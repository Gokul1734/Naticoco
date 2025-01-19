import { useEffect, useState } from "react";
import axios from 'axios';
import { Buffer } from 'buffer';

function getImage(imag) {
 const img = imag.split('/ImageStore/')[1];
  console.log(imag);
  const [images, setImage] = useState(null);
  useEffect(() => {
    axios.get(`http://192.168.29.242:3500/images/${img}`, {
      responseType:'arraybuffer'
    })
      .then(response => {
       const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
       setImage(base64Image);
      })
      .catch(error => console.error(error));
  }, []);

  return images;
}

export default getImage;