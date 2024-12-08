import React from 'react'

export default function InputToSearch({number, changeNumber}) {
  return (
    <>
 <input
        type="text"
        value={number}
        onChange={(e)=>changeNumber(e.target.value)}
        className="w-full placeholder-gray-500 italic p-2 mt-2 border border-gray-300 rounded bg-red-200 text-center"
        placeholder="קוד מסמך לחיפוש"
      />
    </>
  )
}