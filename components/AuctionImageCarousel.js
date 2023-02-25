import { Web3Storage } from "web3.storage";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Image from "next/image";

export default function AuctionImagesCarousel({ cid, compact }) {
  const web3StorageClient = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN,
  });

  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    retrieveFiles();
  }, []);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
  }, [images]);

  const retrieveFiles = async () => {
    try {
      const res = await web3StorageClient.get(cid);
      const files = await res.files();
      setImages(files);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box>
      {images.length > 0 && (
        <swiper-container
          autoplay={compact}
          pagination={!compact}
          navigation={!compact}
          loop={!compact}
        >
          {imageUrls.map((imageUrl, index) => (
            <swiper-slide key={index}>
              <Box
                display="flex"
                justifyContent="center"
                position="relative"
                height={compact ? 250 : 400}
              >
                <Image src={imageUrl} alt={images[index].name} fill />
              </Box>
            </swiper-slide>
          ))}
        </swiper-container>
      )}
    </Box>
  );
}
