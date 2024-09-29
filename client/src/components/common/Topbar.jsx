import { useSelector, useDispatch } from "react-redux"
import MenuIcon from "@mui/icons-material/Menu"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import WbSunnyOutlinedIcon from "@mui/icons-material/wbSunnyOutlined"
import { cloneElement, useState } from "react"
import { Link } from "react-router-dom"
import menuConfigs from "../../configs/menu.configs"
import {themeModes} from "../../configs/theme.configs"
import {setAuthModalOpen} from "../../redux/features/authModalSlice"
import {setThemeMode} from "../../redux/features/themeModeSlice"
import Logo from "./Logo"


const ScrollAppBar = ({children, window}) => {
    const {themeMode} = useSelector((state) => state.themeMode)
}
const Topbar = () => {
  return (
    <div>
      
    </div>
  )
}

export default Topbar
