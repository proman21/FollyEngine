# Copyright (c) 2017 Ned Hoy <nedhoy@gmail.com>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

from flask_app import model
from flask_app import schema
from flask_app.data_access import Database

from flask_app.actions import nodes
from flask_app.actions.nodes import (
    CompoundStatement,
    IfElseStatement,
    PrintStatement,
    AssignmentStatement,
    SetAttrStatement,
    OutputStatement,
    BinaryOp,
    BooleanLiteral,
    IntegerLiteral,
    StringLiteral,
    GetAttrExpression,
    VariableNameExpression,
)
from flask_app.actions import unparser

def add_devices(db):

    headset_model = model.DeviceModel(
        name="headset model 1",
        type=model.DeviceTypes.Headset,
        part_name="Plantronics Voyager 5200",
        description="headset description 1",
    )
    scanner_model = model.DeviceModel(
        name="scanner model 1",
        type=model.DeviceTypes.Scanner,
        part_name="Scanner 5200",
        description="scanner description 1",
    )

    device_models = [
        headset_model,
        scanner_model,
    ]

    for device_model in device_models:
        db.add_model(device_model)

    scanner_device_1 = model.PhysicalDevice(
        id="1",
        model_id=scanner_model.id,
        ip="10.0.0.1",
        purpose="rfid reader",
    )

    scanner_device_2 = model.PhysicalDevice(
        id="2",
        model_id=scanner_model.id,
        ip="10.0.0.2",
        purpose="rfid reader",
    )

    emics_device = model.PhysicalDevice(
        id="3",
        model_id=headset_model.id,
        ip="10.0.0.3",
        purpose="emic text to speech",
    )

    devices = [
        scanner_device_1,
        scanner_device_2,
        emics_device,
    ]

    for device in devices:
        db.add_device(device)

    emics_output = model.DeviceOutput(
        device_id=emics_device.id,
        type=model.OutputTypes.Text2Speech,
        name="emics",
        description="output description 1",
    )

    outputs = [
        emics_output
    ]

    for output in outputs:
        db.add_output(output)

    rfid_input = model.DeviceInput(
        device_id=scanner_device_1.id,
        type=model.InputTypes.Rfid,
        name="rfid",
        description="input description 1",
    )
    inputs = [
        rfid_input,
    ]

    for input in inputs:
        db.add_input(input)

    return devices

def add_scenes(db):
    scenes = [
        model.Scene(name="Scene 0", description="description"),
        model.Scene(name="Scene 1", description="description"),
        model.Scene(name="Scene 2", description="description"),
    ]

    for scene in scenes:
        db.add_scene(scene)

    return scenes

def add_entities(db):
    player_entity = model.VirtualEntity(title="Player", description="player")
    card_entity = model.VirtualEntity(title="Card", description="card")
    greeting_tag_entity = model.VirtualEntity(title="GreetingTag", description="scan to hear pitch")

    entities = [
        player_entity,
        card_entity,
        greeting_tag_entity,
    ]

    for entity in entities:
        db.add_virtual_entity(entity)

    attributes = {
        player_entity: [
            schema.Property("name", schema.String()),
            schema.Property("counter", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("card", schema.Numeric(type=schema.NumericType.Integer)),
        ],

        card_entity: [
            schema.Property("value", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("name", schema.String()),
        ],

        greeting_tag_entity: [
        ],
    }

    for entity, attributes in attributes.items():
        for attribute in attributes:
            db.add_virtual_entity_property(entity, attribute)


    player1_instance = model.InstanceEntity(virtual_entity=player_entity, tag="RFID#player1")
    db.add_instance_entity(player1_instance)
    db.set_instance_entity_property(player1_instance, "name", "Player 1")
    db.set_instance_entity_property(player1_instance, "counter", 0)
    db.set_instance_entity_property(player1_instance, "card", -1)

    player2_instance = model.InstanceEntity(virtual_entity=player_entity, tag="RFID#player2")
    db.add_instance_entity(player2_instance)
    db.set_instance_entity_property(player2_instance, "name", "Player 2")
    db.set_instance_entity_property(player2_instance, "counter", 0)
    db.set_instance_entity_property(player2_instance, "card", -1)

    ROCK = 0
    PAPER = 1
    SCISSORS = 2

    names = {
        ROCK: "rock",
        PAPER: "paper",
        SCISSORS: "scissors",
    }

    # TODO: add the real RFID tags here!
    rfid_tags = {
        (ROCK, 1): "4C00B2E29A86",
        (ROCK, 2): "82003C7375B8",
        (PAPER, 1): "4C00B3F8C8CF",
        (PAPER, 2): "82003C9D290A",
        (SCISSORS, 1): "7C0019CBA10F",
        (SCISSORS, 2): "7C0056A3B039",
    }

    for card_type in [ROCK, PAPER, SCISSORS]:
        card_name = names[card_type]
        for i in range(1, 3):
            tag = rfid_tags[card_type, i]
            card_instance = model.InstanceEntity(virtual_entity=card_entity, tag=tag)
            db.add_instance_entity(card_instance)
            db.set_instance_entity_property(card_instance, "value", card_type)
            db.set_instance_entity_property(card_instance, "name", card_name)

    greeting_tag_instance = model.InstanceEntity(virtual_entity=greeting_tag_entity, tag="RFID#greeting_tag") # TODO: add the real greeting tag ID!
    db.add_instance_entity(greeting_tag_instance)

    return entities

def add_actions(db):
    emics_device_id = 3 # FIXME: don't hardcode this

    setup = [
        AssignmentStatement(
            name="__PLAYER1__",
            rvalue=IntegerLiteral(1), # FIXME: hardcoding instance ID of Player1
        ),
        AssignmentStatement(
            name="__PLAYER2__",
            rvalue=IntegerLiteral(2), #FIXME: hardcoding instance ID of Player2
        ),
    ]

    get_card_name = lambda playerCard, cardName: [
        IfElseStatement(
            condition=BinaryOp(
                left=VariableNameExpression(name=playerCard),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            if_body=AssignmentStatement(
                name=cardName,
                rvalue=StringLiteral("ROCK"),
            ),
            else_body=IfElseStatement(
                condition=BinaryOp(
                    left=VariableNameExpression(name=playerCard),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(1),
                ),
                if_body=AssignmentStatement(
                    name=cardName,
                    rvalue=StringLiteral("PAPER"),
                ),
                else_body=AssignmentStatement(
                    name=cardName,
                    rvalue=StringLiteral("SCISSORS"),
                ),
            ),
        ),
    ]

    calculate_winner = [
        # p1Card := Player1.card
        AssignmentStatement(
            name="p1Card",
            rvalue=GetAttrExpression(
                obj="__PLAYER1__",
                name="card",
            )
        ),
        # p2Card := Player2.card
        AssignmentStatement(
            name="p2Card",
            rvalue=GetAttrExpression(
                obj="__PLAYER2__",
                name="card",
            )
        ),
        IfElseStatement(
            # If p1Card == -1 or p2Card == -1 then wait for both players to scan
            condition=BinaryOp(
                left=BinaryOp(
                    left=VariableNameExpression(name="p1Card"),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(-1),
                ),
                operator=nodes.Operator.LOGICAL_OR,
                right=BinaryOp(
                    left=VariableNameExpression(name="p2Card"),
                    operator=nodes.Operator.EQ,
                    right=IntegerLiteral(-1),
                ),
            ),
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Waiting for players...")),
            ]),
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral(">>> Calculating winner")),
                # winner := (p1Card - p2Card) % 3
                # Thank Taz for the math :D
                AssignmentStatement(
                    name="winner",
                    rvalue=BinaryOp(
                        left=BinaryOp(
                            left=VariableNameExpression(name="p1Card"),
                            operator=nodes.Operator.SUB,
                            right=VariableNameExpression(name="p2Card"),
                        ),
                        operator=nodes.Operator.MOD,
                        right=IntegerLiteral(3)
                    ),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=VariableNameExpression(name="winner"),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1), # 1 -> Player 1 wins
                    ),
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral(">>> Player 1 Wins!!!")),
                        AssignmentStatement(
                            name="winnerAnnounce",
                            rvalue=StringLiteral("Player 1 wins"),
                        ),
                    ]),
                    else_body=IfElseStatement(
                        condition=BinaryOp(
                            left=VariableNameExpression(name="winner"),
                            operator=nodes.Operator.EQ,
                            right=IntegerLiteral(2), # 2 -> Player 2 wins
                        ),
                        if_body=CompoundStatement(statements=[
                            PrintStatement(StringLiteral(">>> Player 2 Wins!!!")),
                            AssignmentStatement(
                                name="winnerAnnounce",
                                rvalue=StringLiteral("Player 2 wins"),
                            ),
                        ]),
                        else_body=CompoundStatement(statements=[
                            PrintStatement(StringLiteral(">>> DRAW!!!")),
                            AssignmentStatement(
                                name="winnerAnnounce",
                                rvalue=StringLiteral("It was a draw, play again"),
                            ),
                        ]),
                    ),
                ),

                # Copy in statements to calculate the card name
                *get_card_name("p1Card", "p1CardName"),
                *get_card_name("p2Card", "p2CardName"),

                AssignmentStatement(
                    name="outputString",
                    rvalue=BinaryOp(
                        left=StringLiteral("Player 1 played "),
                        operator=nodes.Operator.ADD,
                        right=BinaryOp(
                            left=VariableNameExpression("p1CardName"),
                            operator=nodes.Operator.ADD,
                            right=BinaryOp(
                                left=StringLiteral(" and player 2 played "),
                                operator=nodes.Operator.ADD,
                                right=BinaryOp(
                                    left=VariableNameExpression("p2CardName"),
                                    operator=nodes.Operator.ADD,
                                    right=BinaryOp(
                                        left=StringLiteral(" and "),
                                        operator=nodes.Operator.ADD,
                                        right=VariableNameExpression("winnerAnnounce")
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),

                PrintStatement(VariableNameExpression(name="outputString")),

                OutputStatement(
                    output=emics_device_id,
                    resource=VariableNameExpression(name="outputString"),
                ),

                # Reset Player1.card := -1
                SetAttrStatement(
                    obj="__PLAYER1__",
                    name="card",
                    rvalue=IntegerLiteral(-1),
                ),
                # Reset Player2.card := -1
                SetAttrStatement(
                    obj="__PLAYER2__",
                    name="card",
                    rvalue=IntegerLiteral(-1),
                ),
            ]),
        ),
    ]

    rps1 = CompoundStatement(statements=[
        # Copy in setup statements
        *setup,

        # Print Player1.name
        PrintStatement(
            expression=GetAttrExpression(
                obj="__PLAYER1__",
                name="name",
            )
        ),
        # Set Player1.card := __INPUT__.num
        SetAttrStatement(
            obj="__PLAYER1__",
            name="card",
            rvalue=GetAttrExpression(
                obj="__INPUT__",
                name="value",
            )
        ),

        # Copy in statements to calculate the winner
        *calculate_winner,
    ])

    rps2 = CompoundStatement(statements=[
        # Copy in setup statements
        *setup,

        # Print Player2.name
        PrintStatement(
            expression=GetAttrExpression(
                obj="__PLAYER2__",
                name="name",
            )
        ),
        # Set Player2.card = __INPUT__.num
        SetAttrStatement(
            obj="__PLAYER2__",
            name="card",
            rvalue=GetAttrExpression(
                obj="__INPUT__",
                name="value",
            )
        ),

        # Copy in statements to calculate the winner
        *calculate_winner,
    ])

    greeting = """
Welcome to real engine, the video game engine for the real world.

We are six UQ students who've created an offline web application that manages communication between different hardware devices and allows the creation of complex live action role playing games using our intuitive user interface.

It currently supports RFID scanners as input and text to speech bluetooth audio output.
Once devices are connected the game "architect" can add their game logic by defining object entities within their game and then define which hardware inputs trigger which actions.
Conditions can be added to your actions in case you want the action to be determined and not happen all the time.

Our clients include larping, art galleries, museums and even small businesses who want a unique marketing method.
Our system is unique as it allows everyday people to design the logic behind the actions, you don’t need to be a software engineer to program our system as the UI simplifies everything for you.
    """.strip()

    greeting_ast = CompoundStatement(statements=[
        OutputStatement(
            output=emics_device_id,
            resource=StringLiteral('greeting'),
        )
    ])


    rps1_str = unparser.to_json(rps1)
    rps2_str = unparser.to_json(rps2)
    greeting_ast_str = unparser.to_json(greeting_ast)

    player_entity = db.get_virtual_entity_by_name(name="Player")
    card_entity = db.get_virtual_entity_by_name(name="Card")
    greeting_tag_entity = db.get_virtual_entity_by_name(name="GreetingTag")

    actions = [
        model.Action(name="Rock-Paper-Scissors (Player 1)", ast=rps1_str, wants_entity=card_entity),
        model.Action(name="Rock-Paper-Scissors (Player 2)", ast=rps2_str, wants_entity=card_entity),
        model.Action(name="Greeting", ast=greeting_ast_str, wants_entity=greeting_tag_entity),
    ]

    for action in actions:
        db.add_action(action)

    return actions

def add_events(db, *, actions, devices, scenes):
    events = [
        model.Event(
            name="Event 1",
            scene_id=scenes[0].id, # FIXME: why do we need this again?
            type=model.EventTypes.scan,
            device_id=devices[0].id,
        ),
        model.Event(
            name="Event 2",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[1].id,
        ),
    ]

    for event in events:
        db.add_event(event)

    event_actions_list = [
        # Player 1 action
        model.EventActions(event_id=events[0].id, action_id=actions[0].id),

        # Player 2 action
        model.EventActions(event_id=events[1].id, action_id=actions[1].id),

        # Allow scanning the greeting tag on either device
        model.EventActions(event_id=events[0].id, action_id=actions[2].id),
        model.EventActions(event_id=events[1].id, action_id=actions[2].id),
    ]

    for event_actions in event_actions_list:
        db.add_event_action(event_actions)

    return events


if __name__ == '__main__':
    db = Database()

    db.wipe_database()
    db.create_database()

    devices = add_devices(db)
    scenes = add_scenes(db)
    entities = add_entities(db)
    actions = add_actions(db)
    events = add_events(db, actions=actions, devices=devices, scenes=scenes)
