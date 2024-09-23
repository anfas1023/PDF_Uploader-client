import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// import PdfComp from '../../PdfComp';

import { pdfjs } from "react-pdf";
import { Link } from "react-router-dom";

// Ensure the correct path
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url
// ).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Pdf {
  id: number;
  path: string;
  name: string;
}

interface PdfDataProps {
  pdfs: Pdf[]; // The list of PDFs passed as props
  setPdfs: React.Dispatch<React.SetStateAction<Pdf[]>>;
  loading: boolean;
  error: string;
}

const PdfData: React.FunctionComponent<PdfDataProps> = ({
  pdfs,
  setPdfs,
  loading,
  error,
}) => {
  // const [pdfs, setPdfs] = useState<Pdf[]>([]);

  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch PDF data from the backend
  //   const fetchPdfs = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:3000/user/pdfs/1`);
  //       console.log(response.data);

  //       setPdfs(response.data.pdfs);
  //     } catch (err) {
  //       setError('Error fetching PDFs');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPdfs();
  //   console.log("dsf");

  // }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <div className="flex  flex-col items-center w-full p-8">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="w-full mt-8">
          <ul className="flex flex-wrap gap-x-20 gap-y-9">
            {pdfs.map((pdf) => (
              <li
                key={pdf.id}
                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
              >
                <a
                  href={`http://localhost:3000/${pdf.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    setSelectedPdf(`http://localhost:3000/${pdf.path}`)
                  } // Set selected PDF on click
                  className=" p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 truncate"
                >
                  {pdf.name}
                </a>
                <Link to={`/show?data=${pdf.path}`}>
                  <button className="mt-7 ml-9 border px-10 py-3 rounded-lg">Show</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PdfData;
