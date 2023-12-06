import "./App.css";
import "./index.css";
import demoImage from "./images/demo.png"
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {storage} from "./firebase";
import { db } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 } from "uuid";
import {
  collection,  
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export default function Cssdesign() {
  const [imageUpload, setImageUpload] = useState(null)
  const [selectedValue, setSelectedValue] = useState("")
  const [itemInfo, setItemInfo] = React.useState({
    name: "",
    github: "",
    live: ""  
  })
  
  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value)
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const imageRef = ref(storage, `${selectedValue}/${imageUpload.name}`);
      await uploadBytes(imageRef, imageUpload)
      const imageUrl = await getDownloadURL(imageRef)
      const messageCol = collection(db, `${selectedValue}`)
      const docRef = await addDoc(messageCol, {
        name: itemInfo.name,
        imageUrl: imageUrl,
        github: itemInfo.github,
        live: itemInfo.live,
        timestamp: serverTimestamp()
      })
    }catch (error) {
      console.log("Error adding document", error)
    }
  }
const handleImageChange = (event) => {
  const preview = document.getElementById('preview-image'); 
  const file = event.target.files[0];
  setImageUpload(event.target.files[0]);  
  const reader = new FileReader();    
  reader.onload = function(e) {     
    preview.src = e.target.result;   
  };    
  if (file) {     
    reader.readAsDataURL(file);   
  }  
}

  return (
    <form className="app" onSubmit={handleSubmit}>
      <div class="image-preview-div">
        <img id="preview-image" src={demoImage} alt="Preview Image"/>
        <input
        type="file"
        id="imageInput"
        accept="images/*"
        onChange={handleImageChange}
        required />
      </div>
      <div className="project-input-div">
        <input 
        class="project-name"
        type="text"
        name="name"
        value={itemInfo.name}
        onChange={handleChange}
        placeholder="Project Name"
        required
      />
      <input 
        class="project-github"
        type="text"
        name="github"
        value={itemInfo.github}
        onChange={handleChange}
        placeholder="Github link"
        required
      />
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="cssdesign">cssdesign</option>
        <option value="vanilla">vanilla</option>
        <option value="react">react</option>
        <option value="game">game</option>
        <option value="landing">landing</option>
      </select>
      <input 
        class="project-live"
        type="text"
        name="live"
        value={itemInfo.live}
        onChange={handleChange}
        placeholder="Live preview link"
        required
      />
      </div>
      <button>POST</button>
    </form>
  );
}
