import * as React from "react";

import {
    Alignment,
    Button,
    Classes,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
    Popover,
    Menu,
    MenuItem,
    Spinner,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";

interface ActionMenuProps {
  actionMap: {
    [actionName: string]: {
      icon: string
      action: () => void
    }
  }
}

export const ActionMenu = (props: ActionMenuProps) => {

  const { actionMap } = props

  return <Menu>
    {Object.keys(actionMap).map(val => <MenuItem text={val} onClick={() => actionMap[val].action()}/>)}
  </Menu>
};

interface ActionBarProps {
  actionMap: {[actionName: string]: {
    icon: string
    action: () => void
  }}
  loading: boolean
}

export default function ActionBar(props: ActionBarProps) {

      const navigate = useNavigate()
      
      return (
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
                      <NavbarHeading onClick={() => navigate('/')}> CS1951V </NavbarHeading>
                      <NavbarDivider />
                      {props.loading ? <Spinner size={20} /> : null }
                  </NavbarGroup>
          {Object.keys(props.actionMap).length > 0 && <NavbarGroup align={Alignment.RIGHT}>
            <Popover content={<ActionMenu {...props}/>}>
              <Button
                className={Classes.MINIMAL}
                icon="add" text="New" intent="success"
                rightIcon="caret-down"
              />
            </Popover>
            
          </NavbarGroup>}
          
        </Navbar>
      );
}