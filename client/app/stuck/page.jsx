"use client";
import React, { useEffect, useState } from "react";
import RTable from "../component/reqTable/RTable";
import { parseString } from "xml2js";
import axios from "axios";
import LoadingMood from "../component/LoadingMood";
import TheError from "../component/TheError";
import useStuckFiles from "../hook/useStuckFiles";
import HomeBtn from "../component/btns/HomeBtn";



export default function Stuck() {

  // סטייט שיצרנו שמכיל את הקבצים התקועים
  const {stuckFiles, link} = useStuckFiles();

  // מכיל את הקבצים התקועים
  const [filteredData, setFilteredData] = useState([]);

  // אם יש טעינה
  const [loading, setLoading] = useState(false);

  // אם יש שגיאה
  const [error, setError] = useState("");

  function formatDate(dateStr) {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}/${month}/${day}`;
  }

  
  // מביא את המידע לטבלה
  useEffect(() => {
    const fetchData = async () => {
      if (stuckFiles.length === 0) {
        return;
      }

      setLoading(true);
      
      // להביא את הקישור לקובץ ולהביא אותו כסטרינג 
      try {
        const promises = stuckFiles.map(({ filePath, folderPath }) => {
          // קישור לקובץ
          const encodedFilePath = encodeURIComponent(filePath);
          // קישור לתקייה
          const encodedFolderPath = encodeURIComponent(folderPath);
          // console.log(`Fetching data for file: ${filePath} and folder: ${folderPath}`);
          return Promise.all([
            axios.get(`http://localhost:8080/api/file?path=${encodedFilePath}`),
            axios.get(`http://localhost:8080/api/checkStuckFiles?path=${encodedFolderPath}`),
          ]);
        });
        
    
        
        // מכיל את המידע
        const responses = await Promise.all(promises);
      

        // מכיל את המידע
        const filteredResults = [];
        //  בודק אם המידע של קבוצת חומר מופיע יותר מפעם אחת (חייב להיות פה ולא במיקום אחר)
        const seenMatGrp = new Set(); 

        // תוצאה, הלינק, וזמן יצירת המסמך
        responses.forEach(([fileResponse, linksResponse], index) => {
          const results = fileResponse.data.contents;
          const links = linksResponse.data.stuckFiles.map(file => file.filePath); 
  
          const creationTimes = fileResponse.data.creationTimes;

          // עושה סטרינג מהקובץ כדי לקרוא אותו
          results.forEach((xmlData, resultIndex) => {
            parseString(xmlData, { explicitArray: false }, (err, parsedResult) => {
              if (err) {
                setError("כנראה שחלק מהקבצים שגויים");
                return;
              }

              // המידע שבקובץ
              const fileData = parsedResult.ZPREQCR_NAMA01;
              const credat = fileData.IDOC.EDI_DC40.CREDAT;
              const formattedDate = formatDate(credat);

              // אם המידע כמערך הוא קורא אותו ואם לא אז הוא הופך אותו למערך כדי לקרוא
              let e1bpebanc = fileData.IDOC.E1PREQCR.E1BPEBANC;              
              e1bpebanc = Array.isArray(e1bpebanc) ? e1bpebanc : [e1bpebanc];

              e1bpebanc.forEach(item => {
                const mat_grp = item.MAT_GRP;

                if (!seenMatGrp.has(mat_grp)) {
                  const matchedWithCredat = {
                    ...item,
                    CREDAT: formattedDate,
                    link: links[index],
                    linkToXML: results[resultIndex],
                    creationTime: creationTimes[resultIndex],
                  };

                  filteredResults.push(matchedWithCredat);
                  seenMatGrp.add(mat_grp); // מסמן אותו כנמצא
                }
              });
            });
          });
        });

      setFilteredData(filteredResults);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`לא הצלחתי להביא מידע : ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stuckFiles]); 

  return (
    <>
      {/* אם נטען */}
      {loading && <LoadingMood />}

      {/* אם יש שגיאה */}
      {error && <TheError error={error} setError={setError}/>}

      {/* כפתור לדף הבית */}
      <div className="text-right">
        <HomeBtn/>
        </div>
      {/* הטבלה */}
      {!loading && !error && <RTable filteredData={filteredData} />}
    </>
  );
}
