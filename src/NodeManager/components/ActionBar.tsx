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

interface NewMenuProps {
  onCreateNode: () => void
  onCreateImmutableNode: () => void
}

export const NewMenu = (props: NewMenuProps) => (
  <Menu>
      <MenuItem text="Node" icon="document" onClick={() => props.onCreateNode()}/>
      <MenuItem text="Immutable Text Node" icon="document" onClick={() => props.onCreateImmutableNode()}/>
  </Menu>
);

interface ActionBarProps {
  onCreateNode: () => void
  onCreateImmutableNode: () => void
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
          <NavbarGroup align={Alignment.RIGHT}>
            <Popover content={<NewMenu {...props}/>}>
              <Button
                className={Classes.MINIMAL}
                icon="add" text="New" intent="success"
                rightIcon="caret-down"
                // onClick={() => props.onNew()}
              />
            </Popover>
            
          </NavbarGroup>
          
        </Navbar>
      );
}