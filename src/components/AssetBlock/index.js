import React from "react";
import { Row, Col } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-reveal";
import loadable from "@loadable/component";
import * as S from "./styles";
import { Link } from "react-router-dom";

const Button = loadable(() => import("../../common/Button"));

const AssetBlock = ({
  title,
  content,
  button,
  button2,
  t,
  id,
  owner,
  size,
  phone,
  email,
  picture,
  startDate,
  endDate,
}) => {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    element.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <S.MiddleBlock>
      <Row type="flex" justify="center" align="middle" id={id}>
        <Fade bottom>
          <S.ContentWrapper>
            <Col lg={24} md={24} sm={24} xs={24}>
              <p>
                Available from <strong>{startDate}</strong> until{" "}
                <strong>{endDate}</strong>
              </p>
              <h6>{t(title)}</h6>
              <img
                src={picture}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "100%",
                }}
              ></img>
              <S.Content>
                {content} <br />
                <br />
                <br />
                <strong></strong>
                <br />
                <strong>Approx Size Available:</strong> {size}m<sup>3</sup>{" "}
                <br />
                <br />
                <strong>Owner:</strong> {owner}
                <br />
                <strong>Email:</strong> <a href={"mailto:" + email}>{email}</a>
                <br />
                <strong>Phone:</strong> <a href={"tel:" + phone}>{phone}</a>
                <br />
                <br />
                <br />
                <p>
                  Please contact the owner if you wish to use this space.
                  Remember, if you are using storage space, you are also
                  expected to give it in the next term.
                </p>
              </S.Content>
              {button ? (
                <>
                  {/* <Button
                    style={{ margin: "5px" }}
                    name="edit"
                    onClick={button2}
                  >
                    Edit Listing
                  </Button> */}

                  <Button
                    style={{ margin: "5px" }}
                    name="delete"
                    onClick={button}
                  >
                    Delete Listing
                  </Button>
                </>
              ) : (
                ""
              )}
            </Col>
          </S.ContentWrapper>
        </Fade>
      </Row>
    </S.MiddleBlock>
  );
};

export default withTranslation()(AssetBlock);
