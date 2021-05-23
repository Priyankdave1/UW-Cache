import React from "react";
import loadable from "@loadable/component";
import ContactContent from "../../content/ContactContent.json";

const Container = loadable(() => import("../../common/Container"));

const Terms = () => {
  return (
    <Container>
      <h2>Terms and Conditions</h2>
      If you are here, you are cool. Nobody ever reads the terms and conditions.
      Please collect $2000 as you pass go.
    </Container>
  );
};

export default Terms;
