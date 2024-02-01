import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';

import Logout from "../Logout/Logout";
import ThemeSwitch from '../ThemeSwitch.jsx'

import {Nav, Header, CustomLink, Footer, Nickname, BreakLine, Switches} from './Navbar.style'
import {Avatar} from "../../shared/ui/Avatar/Avatar";

export default function Navbar(props) {
  const {user, handleUserSet} = props;

  return (
    <Nav>
      <Header>
          <CustomLink to="/searchUser"><SearchIcon/></CustomLink>
          <CustomLink to="/"><ChatIcon/></CustomLink>
      </Header>
      <Footer>
        <Avatar user={user}/>
        <Nickname>{user.nickname}</Nickname>
        <BreakLine/>
        <Switches>
          <ThemeSwitch/>
          <Logout handleUserSet={handleUserSet} />
        </Switches>
      </Footer>
    </Nav>
  );
}





