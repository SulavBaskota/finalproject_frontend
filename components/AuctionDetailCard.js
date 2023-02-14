import { Typography, Stack, Paper, Box } from "@mui/material";
import { ethers } from "ethers";
import dayjs from "dayjs";
import { Web3Storage } from "web3.storage";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AuctionDetailCard({ item, children }) {
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
    const res = await web3StorageClient.get(item._cid);
    const files = await res.files();
    setImages(files);
  };

  const AuctionImagesCarousel = () => (
    <Box>
      <swiper-container pagination navigation loop>
        {imageUrls.map((imageUrl, index) => (
          <swiper-slide>
            <Box display="flex" justifyContent="center">
              <Image
                src={imageUrl}
                width={300}
                height={300}
                alt={images[index].name}
              />
            </Box>
          </swiper-slide>
        ))}
      </swiper-container>
    </Box>
  );

  return (
    <Paper elevation={4}>
      <Box p={2}>
        <Stack spacing={2}>
          <AuctionImagesCarousel />
          <Typography>Address: {item._contractAddress}</Typography>
          <Typography>Seller: {item._seller}</Typography>
          <Stack direction="row" spacing={2}>
            <Typography>
              Start Time:{" "}
              {dayjs.unix(item._startTime).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography>
              End Time: {dayjs.unix(item._endTime).format("DD/MM/YYYY HH:mm")}
            </Typography>
          </Stack>
          <Typography>
            Mimimum Bid: {ethers.utils.formatUnits(item._minimumBid, "ether")}{" "}
            ETH
          </Typography>
          {children}
        </Stack>
      </Box>
    </Paper>
  );
}
