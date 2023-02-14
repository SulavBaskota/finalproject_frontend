import {
  Button,
  TextField,
  Stack,
  ImageList,
  Box,
  ImageListItem,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Image from "next/image";

const Input = styled("input")({
  display: "none",
});

export default function ImageUpload({ images, setImages }) {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
  }, [images]);

  const handleChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleClear = () => {
    setImages([]);
  };

  return (
    <>
      {images.length > 0 && imageUrls.length > 0 && (
        <Box>
          <ImageList cols={3} rowHeight={200}>
            {imageUrls.map((item, index) => (
              <ImageListItem key={index}>
                <Image src={item} alt="" fill quality={25} />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          value={
            images.length > 0
              ? `${images.length} file(s) chosen`
              : "No file chosen"
          }
          label="Choose images to upload"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <Input
          accept="image/*"
          id="select-images"
          type="file"
          multiple
          onChange={handleChange}
        />
        <Stack direction="row" spacing={1}>
          {images.length > 0 && (
            <Button variant="outlined" color="error" onClick={handleClear}>
              Clear
            </Button>
          )}
          <label htmlFor="select-images">
            <Button variant="contained" component="span" size="large">
              <UploadIcon />
              Upload
            </Button>
          </label>
        </Stack>
      </Stack>
    </>
  );
}
