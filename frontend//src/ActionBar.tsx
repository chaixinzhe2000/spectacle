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
	InputGroup,
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
		{Object.keys(actionMap).map(val => <MenuItem text={val} onClick={() => actionMap[val].action()} />)}
	</Menu>
};

interface ActionBarProps {
	actionMap: {
		[actionName: string]: {
			icon: string
			action: () => void
		}
	}
	loading: boolean
}

export default function ActionBar(props: ActionBarProps) {

	const navigate = useNavigate()

	return (
		<Navbar>
			<NavbarGroup align={Alignment.LEFT}>
				<NavbarHeading onClick={() => navigate('/')}> Spectacle Hypertext </NavbarHeading>
				<NavbarDivider />
				{props.loading ? <Spinner size={20} /> : null}
			</NavbarGroup>

			{<NavbarGroup align={Alignment.RIGHT}>
				<InputGroup
					type="search"
					leftIcon="search"
					placeholder="Search">
				</InputGroup>
				{/* <Popover content={<ActionMenu {...props}/>}>
              <Button
                className={Classes.MINIMAL}
                icon="add" text="New" intent="success"
                rightIcon="caret-down"
              />
            </Popover> */}
				{/* <InputGroup>
			
			</InputGroup> */}

			</NavbarGroup>}

		</Navbar>
	);
}