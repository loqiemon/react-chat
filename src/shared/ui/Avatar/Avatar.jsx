import styled from 'styled-components';
import avatar from '../../../assets/avatar.svg'
import {Link} from "react-router-dom";

const Avatar = (props) => {
  const {user} = props;

  const isAvatar = (image) => {
      return image ? `data:image/svg+xml;base64,${image}` : avatar;
  }

  return (
    <StyledLink to={"/profile"}>
        <Img src={isAvatar(user.image)} alt="Аватар"/>
    </StyledLink>
  );
};

export {Avatar};

const StyledLink = styled(Link)`
  cursor: pointer;
`

const Img = styled.img`
  width: 82px;
  height: 82px;
`

