import { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";
import { db } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const useForm = (
  validate,
  edit,
  asset,
  setDefaultAsset,
  size,
  setDefaultSize,
  location,
  setDefaultLocation,
  description,
  setDefaultDescription,
  startDate,
  setDefaultStartDate,
  endDate,
  setDefaultEndDate,
  picture
) => {
  const [values, setValues] = useState({
    size: size,
    startDate: startDate,
    endDate: endDate,
    location: location,
    description: description,
    picture: picture,
  });

  const [errors, setErrors] = useState({});
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const { currentUser } = useAuth();
  const user = db.collection("users").doc(currentUser.email);

  const [url, setUrl] = useState("");

  const uploadImage = () => {
    if (values.picture) {
      const data = new FormData();
      data.append("file", values.picture);
      data.append("upload_preset", "UW-cache");
      data.append("cloud_name", "chocolatecloud");
      return fetch(
        "https://api.cloudinary.com/v1_1/chocolatecloud/image/upload",
        {
          method: "post",
          body: data,
        }
      );
    }
  };

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: "Success",
      description: "Your asset has been listed",
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validate(values));
    var location = "";
    var name = "";
    // upload picture to cloudinary

    if (
      values.endDate &&
      values.startDate &&
      values.size &&
      values.description
    ) {
      user
        .get()
        .then((doc) => {
          if (values.location !== undefined) {
            location = values.location;
          } else {
            location = doc.data().address;
          }
          name = doc.data().name;
        })
        .then(() => uploadImage())
        .then((resp) => resp.json())
        .then((data) => {
          console.log("pushing to database");
          console.log("the url is: " + data.url);
          user.collection("listings").doc(values.location).set({
            size: values.size,
            location: location,
            startDate: values.startDate,
            endDate: values.endDate,
            description: values.description,
            owner: name,
            picture: data.url,
          });
          if (edit) {
            user.collection("assets").doc(location).delete();
          }
        })
        .then(() => {
          setShouldSubmit(true);
        });
    }
  };

  useEffect(() => {
    console.log(values);
    if (Object.keys(errors).length === 0 && shouldSubmit) {
      setValues("");
      openNotificationWithIcon("success");
    }
  }, [errors, shouldSubmit]);

  const handleChange = (event) => {
    event.persist();
    setDefaultAsset("");
    setDefaultDescription("");
    setDefaultLocation("");
    setDefaultSize("");
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
    console.log("target: " + [event.target.name]);
    if (event.target.name === "picture") {
      console.log("this is a picture");
      setValues((values) => ({
        ...values,
        [event.target.name]: event.target.files[0],
      }));
    }
    setErrors((errors) => ({ ...errors, [event.target.name]: "" }));
  };

  return {
    handleChange,
    handleSubmit,
    values,
    errors,
  };
};

export default useForm;
