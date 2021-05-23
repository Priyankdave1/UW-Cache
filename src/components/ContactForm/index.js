import React, { useState } from "react";
import { Row, Col } from "antd";
import Zoom from "react-reveal/Zoom";
import loadable from "@loadable/component";
import { withTranslation } from "react-i18next";

import useForm from "./useForm";
import validate from "./validationRules";
import * as S from "./styles";

const Block = loadable(() => import("../Block"));
const Input = loadable(() => import("../../common/Input"));
const Button = loadable(() => import("../../common/Button"));
const TextArea = loadable(() => import("../../common/TextArea"));

const Contact = ({
  title,
  content,
  id,
  t,
  edit,
  size,
  location,
  description,
  startDate,
  endDate,
}) => {
  const [defaultSize, setDefaultSize] = useState(size);
  const [defaultLocation, setDefaultLocation] = useState(location);
  const [defaultDescription, setDefaultDescription] = useState(description);
  const [defaultStartDate, setDefaultStartDate] = useState(startDate);
  const [defaultEndDate, setDefaultEndDate] = useState(endDate);
  const [picture, setPicture] = useState("");

  const { values, errors, handleChange, handleSubmit } = useForm(
    validate,
    edit,
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
  );

  const ValidationType = ({ type }) => {
    const ErrorMessage = errors[type];
    return errors[type] ? (
      <Zoom cascade>
        <S.Span>{ErrorMessage}</S.Span>
      </Zoom>
    ) : (
      <S.Span />
    );
  };

  return (
    <S.ContactContainer id={id}>
      <S.Contact>
        <Row type="flex" justify="space-between" align="middle">
          {title ? (
            <Col lg={12} md={11} sm={24}>
              <Block padding={true} title={title} content={content} />
            </Col>
          ) : null}

          <Col lg={12} md={12} sm={24} style={{ margin: "auto" }}>
            <S.FormGroup
              autoComplete="off"
              onSubmit={handleSubmit}
              style={{ margin: "auto" }}
            >
              <Col span={24}>
                <Input
                  type="text"
                  name="location"
                  id="Location"
                  placeholder="Location (if different from your current address)"
                  text={values.location || defaultLocation}
                  onChange={handleChange}
                />
                <ValidationType type="listing" />
              </Col>
              <Row>
                <Col span={12}>
                  <Input
                    type="date"
                    name="startDate"
                    id="Start"
                    placeholder="Starting date"
                    text={values.startDate || defaultStartDate}
                    onChange={handleChange}
                  />
                  <ValidationType type="value" />
                </Col>
                <Col span={12}>
                  <Input
                    type="date"
                    name="endDate"
                    id="End"
                    placeholder="Ending date"
                    text={values.endDate || defaultEndDate}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Col span={24}>
                <Input
                  type="number"
                  name="size"
                  id="Size"
                  placeholder="Approx. Storage Size (meters cubed)"
                  text={values.size || defaultSize}
                  onChange={handleChange}
                />
                <ValidationType type="value" />
              </Col>
              <Col span={24}>
                <Input
                  type="file"
                  name="picture"
                  id="Picture"
                  placeholder="Image of Storage Space"
                  onChange={handleChange}
                />
              </Col>
              <Col span={24}>
                <TextArea
                  placeholder="Detailed Description of listing (size, capacity, any special requirements for item, additional items required for use)"
                  name="description"
                  id="Description"
                  onChange={handleChange}
                  text={values.description || defaultDescription}
                />
                <ValidationType type="description" />
              </Col>
              <S.ButtonContainer>
                <Button name="submit" type="submit">
                  {edit ? t("Update listing") : t("Submit Listing")}
                </Button>
              </S.ButtonContainer>
            </S.FormGroup>
          </Col>
        </Row>
      </S.Contact>
    </S.ContactContainer>
  );
};

export default withTranslation()(Contact);
