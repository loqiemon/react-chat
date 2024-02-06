import SearchIcon from '../../assets/search.svg';
import ChatIcon from '../../assets/chats.svg';
import Logout from "../Logout/Logout";
import ThemeSwitch from '../ThemeSwitch.jsx'

import {Nav, Header, CustomLink, Footer, Nickname, BreakLine, Switches} from './Navbar.style'
import {Avatar} from "../../shared/ui/Avatar/Avatar";
import {Svg} from "../../shared/ui/Svg/Svg";

export default function Navbar(props) {
  const {user, handleUserSet} = props;

  return (
    <Nav>
      <Header>
          <CustomLink to="/searchUser">
              <Svg path={SearchIcon}/>
          </CustomLink>
          <CustomLink to="/">
              <Svg path={ChatIcon}/>
          </CustomLink>
      </Header>
      <Footer>
        <Avatar user={user}/>
        <Nickname>{user?.nickname}</Nickname>
        <BreakLine/>
        <Switches>
          <ThemeSwitch/>
          <Logout handleUserSet={handleUserSet} />
        </Switches>
      </Footer>
    </Nav>
  );
}





