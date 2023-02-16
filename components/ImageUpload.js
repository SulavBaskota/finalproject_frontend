import {
  Button,
  TextField,
  Stack,
  ImageList,
  Box,
  ImageListItem,
  styled,
  useMediaQuery,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

const Input = styled("input")({
  display: "none",
});

export default function ImageUpload({
  images,
  setImages,
  setCompressedImages,
}) {
  const ref = useRef();
  const smallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const imageUrls = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images]
  );

  const handleChange = useCallback(
    async (event) => {
      const originalImages = [...event.target.files];
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };
      setCompressedImages([]);
      const newCompressedImages = await Promise.all(
        originalImages.map((image) => imageCompression(image, options))
      );

      setImages(originalImages);
      setCompressedImages(newCompressedImages);
    },
    [setCompressedImages, setImages]
  );

  const handleClear = () => {
    setImages([]);
    setCompressedImages([]);
    ref.current.value = "";
  };

  return (
    <>
      {images.length > 0 && (
        <Box>
          <ImageList cols={smallScreen ? 2 : 3} rowHeight={200}>
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
          ref={ref}
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
