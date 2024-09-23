import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { useLocation, useSearchParams } from "react-router-dom";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
// import { toast,ToastContainer } from "react-toastify";
import { toast } from "sonner"


const PdfComp: React.FC = React.memo(() => {
  const location = useLocation();
  const [numPages, setNumPages] = useState<number>();
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const myParam = searchParams.get("data");

  console.log("myParam", myParam);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error): void {
    console.error("Failed to load PDF:", error.message);
  }

  const handleCheckboxChange = (pageNumber: number) => {
    setSelectedPages(prevSelectedPages =>
      prevSelectedPages.includes(pageNumber)
        ? prevSelectedPages.filter(page => page !== pageNumber)
        : [...prevSelectedPages, pageNumber]
    );
  };

  const createAndUploadPdf = async () => {
    if (selectedPages.length === 0 || !myParam){
      toast.warning("Select a pages to upload!", {
        position: "top-right"
      });

      return;
    } 
  
    try {
      const response = await fetch(`http://localhost:3000/${myParam}`);
      const existingPdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      for (const pageNumber of selectedPages) {
        const [page] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
        newPdfDoc.addPage(page);
      }
  
      const newPdfBytes = await newPdfDoc.save();
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
  
      const formData = new FormData();
      formData.append("file", blob, "selected-pages.pdf");

      console.log("FormData content: ", formData.get("file"));
  
      setUploading(true);
  
      // Send the form data with the Blob to the server
      const userId=localStorage.getItem("userId")
      const uploadResponse = await axios.post(`http://localhost:3000/user/upload/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (!uploadResponse.data) {
        throw new Error("Failed to upload PDF");
      }
  
      console.log(uploadResponse.data);

      toast.success("Pdf Upload  successful!", {
        position: "top-right"
      });

      setPdfUrl(`http://localhost:3000/${uploadResponse.data.path}`);
      setUploading(false);
  
      setUploading(false);
  
    } catch (error) {
      console.error("Error creating or uploading new PDF:", error);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white min-h-screen">
      <div className="w-full max-w-4xl bg-gray-300 p-4 rounded-lg shadow-lg">
        <Document
          file={`http://localhost:3000/${myParam}`}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="relative"
        >
          {Array.from({ length: numPages ?? 0 }, (_, index) => (
            <div
              key={index}
              className="border-b border-gray-300 pb-4 mb-4 last:border-b-0"
            >
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`page-${index + 1}`}
                  checked={selectedPages.includes(index + 1)}
                  onChange={() => handleCheckboxChange(index + 1)}
                  className="mr-2"
                />
                <label htmlFor={`page-${index + 1}`} className="text-sm">
                  Page {index + 1}
                </label>
              </div>
              <div className="flex justify-center">
                <Page
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </Document>
        <div className="text-center mt-4">
          <p>
            Page {numPages ? 1 : 0} of {numPages || 0}
          </p>
          <button
            onClick={createAndUploadPdf}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={uploading}
          >
            {uploading ? "Creating PDF..." : "Create and Upload PDF"}
          </button>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download="selected-pages.pdf"
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Download New PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

export default PdfComp;
