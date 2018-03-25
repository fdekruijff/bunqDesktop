import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
const remote = require("electron").remote;

import MenuIcon from "material-ui-icons/Menu";
import CloseIcon from "material-ui-icons/Close";
import RestoreIcon from "./CustomSVG/Restore";
import MaximizeIcon from "./CustomSVG/Maximize";
import MinimizeIcon from "./CustomSVG/Minimize";

import { openMainDrawer } from "../Actions/main_drawer";

const buttonDefaultStyles = {
    color: "white",
    WebkitAppRegion: "no-drag",
    position: "fixed",
    top: 1,
    zIndex: 1000
};

const styles = {
    headerMenuBtn: {
        ...buttonDefaultStyles,
        left: 5
    },
    headerRightBtn: {
        ...buttonDefaultStyles,
        right: 5
    },
    headerRightBtn2: {
        ...buttonDefaultStyles,
        right: 50
    },
    headerRightBtn3: {
        ...buttonDefaultStyles,
        right: 95
    },
    header: {
        WebkitAppRegion: "drag",
        WebkitUserSelect: "none",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 10000,
        height: 50,
        zIndex: 1000,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    }
};

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            forceUpdate: null
        };

        this.mainWindow = remote.getCurrentWindow();
    }

    closeApp = () => {
        this.mainWindow.close();
    };

    minimizeApp = () => {
        this.mainWindow.minimize();
    };

    maximizeRestoreApp = () => {
        if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
        } else if (!this.mainWindow.isMinimized()) {
            this.mainWindow.maximize();
        }
        this.setState({ forceUpdate: new Date() });
    };

    render() {
        // the actual menu button
        const menuButton = (
            <IconButton
                aria-label="view main drawer"
                onClick={this.props.openDrawer}
                style={styles.headerMenuBtn}
            >
                <MenuIcon />
            </IconButton>
        );
        // wrap it in a hidden wrapper in case of sticky menu mode
        const wrappedButton = this.props.stickyMenu ? (
            <Hidden mdUp>{menuButton}</Hidden>
        ) : (
            menuButton
        );

        let middleIcon = null;
        if (this.mainWindow.isMaximized()) {
            middleIcon = <RestoreIcon />;
        } else if (!this.mainWindow.isMinimized()) {
            middleIcon = <MaximizeIcon />;
        }
        const windowControls = true ? (
            <React.Fragment>
                <IconButton
                    aria-label="Minimize application"
                    onClick={this.minimizeApp}
                    style={styles.headerRightBtn3}
                >
                    <MinimizeIcon />
                </IconButton>
                <IconButton
                    aria-label="Maximize or restore application"
                    onClick={this.maximizeRestoreApp}
                    style={styles.headerRightBtn2}
                >
                    {middleIcon}
                </IconButton>
                <IconButton
                    aria-label="Exit application"
                    onClick={this.closeApp}
                    style={styles.headerRightBtn}
                >
                    <CloseIcon />
                </IconButton>
            </React.Fragment>
        ) : null;

        return (
            <header style={styles.header} className={"rainbow-background"}>
                {wrappedButton}
                {windowControls}
            </header>
        );
    }
}

const mapStateToProps = store => {
    return {
        stickyMenu: store.options.sticky_menu,
        minimizeToTray: store.options.minimize_to_tray
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // opens the options drawer on the left
        openDrawer: () => dispatch(openMainDrawer())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
