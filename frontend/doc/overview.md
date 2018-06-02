Angular2+ Application. Likely to be somewhat lacking in good practices since the original developers were not well experienced in web development.

# What is this application
A prototype for an interface to designer games to work with the Folly/Real Engine.

This particiular implementation emulates an Entity Component System model. Allowing systems (i.e. behaviour) to be defined on components.
ECS focuses on composing entities of many components. Allowing us to reuse functionality very easily.

Entities are things like Players, objects etc.
Components are parts of things. Examples being a MortalComponent or MagicComponent. Components have attributes which are our raw data types.
Systems is our behaviour. For the prototype these are modeled on a trigger based idea. The primary example being an RFID chip being scanned and triggering
some logic to do with whatever that RFID (Component) is attached to.

Since the target audience was primarily non-programmers flow-based programming was the strategy used to define behaviour.

# Structure

# The app (real-designer/src/app/...)
## Login
Login is fairly simple. In the prototype clicking the "Forgot my password" link will log you in with a guest account
## Project Management
Interface for loading/creating new projects. No support for deletion or editing names etc.
## Entity Management
Fairly straightforward interface for management entities and managing the components attached to them.

Supports:
	- Adding/Deleting entities
	- Adding/Removing components
	- Editing the name of the entity
	- Searching through a list
	- Saving/loading (as a JSON string)
Issues:
	- Interface is somewhat under utilized. Definitely room for design improvements.
	- CSS related to this is not particiularly robust
	- Some minor bugs related to deletion
## Component Management
Similar interface to the entities but focused on making the components and attaching attributes to them.

Supports:
	- Adding/Deleting components (deleted ones are cleared from entities)
	- Adding/Removing attributes
	- Editing the name of the component
	- Searching through a list
	- Saving/loading (as a JSON string)
Issues:
	- Interface is somewhat under utilized. Definitely room for design improvements.
	- CSS related to this is not particiularly robust
## Designer
Holds the designer service which is our top level controller of the entire application. Saves all our state and handles loading etc.
## Flow
Some code related to the raw graph of the flow dealing with things like connections, nodes etc.
## Procedure/Flow Designer
Procedure and flow are used somewhat interchangably here.

Procedures are our systems or behaviour. In the current prototype only one procedure can be prototyped and isn't saved anywhere.
The procedure designer uses the JointJS library to help build the interface.

Rather feature incomplete as it's primary purpose was to demonstrate feasiblity of the concept.

The JointJS	library is somewhat lacking in documentation and features so you can expect to have to define a lot of custom behaviour.
The recommended alternative is to switch to a different library. Some alternatives include the draw.io library, NodeRed, a commerical library,
or to write one from scratch.

The first steps to improving the current prototype:
- **convert the current graph/flow into some data type and send to a backend for parsing** (All the nodes in the editor currently have a corresponding FlowNode (in the flow Folder). The intention was for the FlowNodes to hold the state and the editor nodes to just render from that)
- adding saving/loading
- implementing a procedure management interface
- adding support for individual components to be acted on
- adding more triggers
- adding support for loops etc.
## Assets
A late addition to the project. Not anything really worthwhile here just some testing of folder structures
## Other
- PHP Backend should probably be adapted to something more modern (python?)