import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import cloud from "../../assets/upload.png";
import axios from "axios";
import PdfData from "../pdfData/PdfData";
import empty from "../../assets/vector-illustration-icon-shopping-concept-260nw-502037047.jpg";
import { AuthContext } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom";
// import { toast,ToastContainer } from "react-toastify";
import { toast } from "sonner"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface Pdf {
  id: number;
  path: string;
  name: string;
}
export default function AlertDialogSlide() {
  const navigate=useNavigate()
  const userData=React.useContext(AuthContext)
  const [pdfs, setPdfs] = React.useState<Pdf[]>([]);
  const [open, setOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [file, setFile] = React.useState<File>();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(()=>{
    console.log("userData?.user",userData?.user);
    
if(!userData?.user){
  navigate('/login')
}
  },[userData?.user])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  React.useEffect(() => {
    // Fetch PDF data from the backend
    const fetchPdfs = async () => {
      try {
        const userId=localStorage.getItem("userId")
        const response = await axios.get(`http://localhost:3000/user/pdfs/${userId}`);
        // console.log("iiiiiiiiiiiiiii", response.data);

        setPdfs(response.data.pdfs);
        setLoading(false);
      } catch (err) {
        setError("Error fetching PDFs");
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
    // console.log("dsf");
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload here
      setFile(file);
      console.log(file);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const userId=localStorage.getItem("userId")
      const response = await axios.post(
        `http://localhost:3000/user/upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      const uploadedPdf = response.data;
      setPdfs((prevPdfs) => {
        if (prevPdfs.length > 0) {
          // If existing PDFs exist, append the new one
          return [...prevPdfs, uploadedPdf];
        } else {
          // If no PDFs exist, just set the new one
          return [uploadedPdf];
        }
      });
      handleClose();
      toast.success("Pdf Upload  successful!", {
        position: "top-right"
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col  mt-10 mb-4 items-center justify-around p-8 m-2 border border-gray-300 rounded-lg shadow-lg w-full  max-w-7xl max-h-fit mx-auto">
      
        <div className="flex items-center justify-between w-full mb-6">
          <h2 className="text-2xl font-bold">My Project</h2>
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            variant="contained"
            onClick={handleClickOpen}
          >
            Upload PDF
          </Button>
        </div>

        <Dialog
          open={open}
          TransitionComponent={Transition} // Make sure Transition is defined or imported
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Upload a PDF"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className="flex flex-col items-center justify-center p-8 border-2 w-full">
                <img
                  src={cloud} // Make sure cloud is defined or imported
                  alt="Upload"
                  className="w-72 h-60 object-cover cursor-pointer"
                  onClick={handleImageClick} // Open file input on image click
                />
                <p className="font-semibold mt-4">Upload Images</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="application/pdf" // Accept PDF files only
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogActions>
        </Dialog>

        <div>
          {pdfs.length > 0 ? (
            <>
              <h1 className="text-center font-bold text-3xl">PDF List</h1>
              <PdfData
                pdfs={pdfs}
                setPdfs={setPdfs}
                loading={loading}
                error={error as string}
              />
            </>
          ) : (
            <div className="flex flex-col items-center">
              <img src={empty} alt="No PDFs available" className="w-64 h-64" />
              <h2 className="text-center text-xl font-semibold mt-4">
                No PDFs found
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
