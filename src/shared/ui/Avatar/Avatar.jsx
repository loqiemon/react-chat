import styled from 'styled-components';
import avatar from '../../../assets/avatar.svg'
import {Link} from "react-router-dom";

const Avatar = (props) => {
  const {user, width=82, height=82} = props;

  const isAvatar = (image) => {
      return image ? `data:image/svg+xml;base64,${image}` : avatar;
  }

  return (
    <StyledLink to={"/profile"}>
        <Img $width={width} $height={height} src={isAvatar(user?.image)} alt="Аватар" />
    </StyledLink>
  );
};

export {Avatar};

const StyledLink = styled(Link)`
  cursor: pointer;
`

const Img = styled.img`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;

  @media (max-width: 670px) {
    width: 45px;
    height: 45px;
  }
`

