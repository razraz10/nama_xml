"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function useStuckFiles() {
  const [stuckFiles, setStuckFiles] = useState([]);
  const [link, setLink] = useState([]);

  async function fetchStuckFiles() {
    try {
      const [filesStuck, linksToFolder] = await Promise.all([
        // קריאת הקבצים בתקייה התקועה
        axios.get(`http://localhost:8080/api/checkStuckFiles`),
        // הנתיבים לתיקיות השדרים התקועים
        axios.get(`http://localhost:8080/api/stuckPaths`),
      ]);
      const files = filesStuck.data;
      const links = linksToFolder.data;
      setStuckFiles(files.stuckFiles || []);
      setLink(links);
    } catch (error) {
      console.error("Error fetching stuck files:", error);
    }
  }
    useEffect(() => {
    // ראשוני
    fetchStuckFiles();

    // סריקה כל 10 דקות
    const scanInterval = 1 * 5 * 1000;
    const intervalId = setInterval(fetchStuckFiles, scanInterval);

    // מנקה את הפונקצייה שלא תפעל
    return () => clearInterval(intervalId);
  }, []);

  return { stuckFiles, link, fetchStuckFiles };

}
