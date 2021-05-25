import React from "react";
import { withTranslation } from "react-i18next";

import * as S from "./styles";

const Input = ({ id, name, placeholder, onChange, t, text, type }) => (
  <S.Container>
    <label htmlFor={name}>{id}</label>
    <S.Input
      spellcheck="false"
      placeholder={t(placeholder)}
      value={text}
      name={name}
      id={name}
      onChange={onChange}
      type={type}
    />
  </S.Container>
);

export default withTranslation()(Input);
