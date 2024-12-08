import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import InputPath from "./InputPath";
import ShowPath from "./ShowPath";
import TheError from "./TheError";
import useStuckFiles from "../hook/useStuckFiles";

export default function Status() {
  const { stuckFiles, link, fetchStuckFiles } = useStuckFiles();
  console.log(stuckFiles, "stuckPaths");

  // מכיל את הנתיבים
  const [filePath, setFilePath] = useState(
    ""
  );

  // מראה את הנתיבים בלחיצה על האינפוט
  const [showReqPaths, setShowReqPaths] = useState(false);

  // מכיל את הנתיבים לתיקיות כדי לחפש בהם
  const [reqPaths, setReqPaths] = useState([]);

  // אם יש שגיאה
  const [error, setError] = useState("");


    // בדיקה על שרתי נמה
  const [nama1, setNama1] = useState("");
  const [nama2, setNama2] = useState("");
  const [nama3, setNama3] = useState("");

  // 1
    // Function to check nama1 endpoint status
    const checkNama1 = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/nama1");
        if (response.status === 200) {
          setNama1("נמה 1 תקין");
        }
      } catch (error) {
        console.error("Error checking nama1:", error);
      }
    };
// 2
    // Function to check nama2 endpoint status
    const checkNama2 = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/nama2");
        if (response.status === 200) {
          setNama2("נמה 2 תקין");
        }
      } catch (error) {
        console.error("Error checking nama2:", error);
      }
    };
// 3
    // Function to check nama2 endpoint status
    const checkNama3 = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/nama3");
        if (response.status === 200) {
          setNama3("נמה 3 תקין");
        }
      } catch (error) {
        console.error("Error checking nama3:", error);
      }
    };

  useEffect(() => {
    checkNama1();
    checkNama2();
    checkNama3();
  }, []);


  // להביא את הנתיבים לתיקיות
  const fetchPaths = async () => {
    setReqPaths(link);
  };

  // אם יש שינו באינפוט
  const handleInputChange = (e) => {
    const newFilePath = e.target.value;
    setFilePath(newFilePath);
    setError("");

    // Trigger the scan immediately when input changes
    if (newFilePath) {
      scanPaths(newFilePath);
    }
  };

  // לחיצה על האינפוט של הנתיבים
  const handlePathClick = (path) => {
    setFilePath(path);
    setShowReqPaths(false);
    if (path) {
      scanPaths(path);
    }
  };

  // console.log(stuckFiles, "ffff");
  const scanPaths = async (path) => {
    try {
        const response = await axios.get(
          `http://localhost:8080/api/checkStuckFiles?path=${filePath}`
        );
        console.log(response.data, "data");
        console.log(path, "new link");
        fetchStuckFiles()
        return response.data;

      } catch (error) {
        console.error("Error scanning paths:", error);
        setError("Error scanning paths");
      }
    };

    useEffect(() => {
    if (filePath) {
      console.log(filePath,"filllll");
      scanPaths(filePath);
    }
  }, [filePath]);


  return (
    <div className="w-1/2 flex justify-center items-center">
      <div className="bg-gray-800 text-white w-full h-full p-4 rounded-lg  text-center">
        <h2 dir="rtl" className="text-4xl font-bold mb-4 truncate">
          סטטוס ממשק
        </h2>

        <div dir="rtl" className="text-3xl truncate">
          {nama1 ? <div>{nama1}</div> : <div>נמה 1 לא תקין</div>}
          {nama2 ? <div>{nama2}</div> : <div>נמה 2 לא תקין</div>}
          {nama3 ? <div>{nama3}</div> : <div>נמה 3 לא תקין</div>}
        </div>

        <div
          dir="rtl"
          className="flex justify-center items-center text-center "
        >
          <div className="mx-1 text-3xl"> ישנם</div>
          {/* מראה כמה שדרים תקועים יש */}
          {stuckFiles && (
            <div className="text-red-600 text-3xl">{stuckFiles.length}</div>
          )}
          <div className="truncate text-3xl">שדרים מעוכבים בתיקיית הקליטה</div>
        </div>

        {/* אם יש שדרים תקועים לחץ כדי לעבור לדף הטבלה */}
        {stuckFiles.length > 0 && <Link href={"./stuck"}>(לחץ לפרטים)</Link>}

        {/* אם יש שגיאה */}
        {error && <TheError error={error} setError={setError} />}

        {/* אינפוט לנתיבים */}
        <div className="text-black mt-24 w-full relative">
          <InputPath
            filePath={filePath}
            handleInputChange={handleInputChange}
            fetchPaths={fetchPaths}
            setShowPaths={setShowReqPaths}
            showPaths={showReqPaths}
          />

          {/* מראה נתיבים לתיקיות בלחיצה */}
          {showReqPaths && (
            <ShowPath
              setShowPaths={setShowReqPaths}
              showPaths={showReqPaths}
              path={reqPaths}
              pathClick={handlePathClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}


