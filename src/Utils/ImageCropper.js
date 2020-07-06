import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

class ImageCropper extends PureComponent {
  state = {
    imageRef: null,
    src: null,
    crop: {
      aspect: 7/5,
      x: 0,
      y: 0,
      width: 280,
      height: 200,
    }
  };

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      console.log(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = (image, pixelCrop) => {
    this.state.imageRef = image;
  };

  onCropComplete = (crop, pixelCrop) => {
    this.makeClientCrop(crop, pixelCrop);
    // this.getCroppedImg(this.state.image, pixelCrop, 'preview.jpg')
    //         .then((res) => {
    //             const blobUrl = URL.createObjectURL(res);
    //             console.log(blobUrl); // it returns cropped image in this shape of url: "blob:http://something..."
    //         })
  };

  onCropChange = crop => {
    this.setState({ crop });
  };

  async makeClientCrop(crop, pixelCrop) {
    if (this.state.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.state.imageRef,
        crop,
        "newFile.jpeg"
      );

      this.setState({ croppedImageUrl });
      if(this.props.onCrop)
      {
        this.props.onCrop(croppedImageUrl);
      }
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
   
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
   
    // As Base64 string
    const base64Image = canvas.toDataURL('image/jpeg');
    
    return base64Image;
    // As a blob
    // return new Promise((resolve, reject) => {
    //   canvas.toBlob(blob => {
    //     blob.name = fileName;
    //     resolve(blob);
    //   }, 'image/jpeg', 1);
    // });
  }

  componentWillReceiveProps(nextProp){
    if(nextProp.defaultImage)
    {
      this.setState({
        croppedImageUrl: nextProp.defaultImage
      });
    }
    
  }
   
  // getCroppedImg(image, pixelCrop, fileName) {
  //   const canvas = document.createElement("canvas");
  //   canvas.width = pixelCrop.width;
  //   canvas.height = pixelCrop.height;
  //   const ctx = canvas.getContext("2d");

  //   ctx.drawImage(
  //     image,
  //     pixelCrop.x,
  //     pixelCrop.y,
  //     pixelCrop.width,
  //     pixelCrop.height,
  //     0,
  //     0,
  //     pixelCrop.width,
  //     pixelCrop.height
  //   );

  //   return new Promise((resolve, reject) => {
  //     canvas.toBlob(blob => {
  //       if (!blob) {
  //         //reject(new Error('Canvas is empty'));
  //         console.error("Canvas is empty");
  //         return;
  //       }
  //       blob.name = fileName;
  //       window.URL.revokeObjectURL(this.fileUrl);
  //       this.fileUrl = window.URL.createObjectURL(blob);
  //       resolve(this.fileUrl);
  //     }, "image/jpeg");
  //   });
  // }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="App">
        <div>
          <input type="file" onChange={this.onSelectFile} />
        </div>
        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        {croppedImageUrl && (
          <img alt="Crop" style={{ maxWidth: "100%" }} src={croppedImageUrl} />
        )}
      </div>
    );
  }
}

export default ImageCropper;


