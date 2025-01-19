import { useEffect, useState } from "react";
import axios from 'axios';
import { Buffer } from 'buffer';

function getImage(imag) {
 const img = String(imag).replace('/ImageStore/', '');
  // console.log(imag);
  const [images, setImage] = useState(null);
  useEffect(() => {
    axios.get(`http://192.168.83.227:3500/images/${img}`, {
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