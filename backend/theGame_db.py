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

    speaker_virtual_output = model.VirtualOutput(
        name="Speaker",
        device_output=emics_output
    )
    db.add_virtual_output(speaker_virtual_output)

    wizard_virtual_output = model.VirtualOutput(
        name="Wizard",
        device_output=emics_output
    )
    db.add_virtual_output(wizard_virtual_output)
    central_virtual_output = model.VirtualOutput(
        name="Central",
        device_output=emics_output
    )
    db.add_virtual_output(central_virtual_output)
    ship_virtual_output = model.VirtualOutput(
        name="Ship",
        device_output=emics_output
    )
    db.add_virtual_output(ship_virtual_output)
    cathedral_virtual_output = model.VirtualOutput(
        name="Cathedral",
        device_output=emics_output
    )
    db.add_virtual_output(cathedral_virtual_output)
    castle_virtual_output = model.VirtualOutput(
        name="Castle",
        device_output=emics_output
    )
    db.add_virtual_output(castle_virtual_output)
    train_virtual_output = model.VirtualOutput(
        name="Train",
        device_output=emics_output
    )
    db.add_virtual_output(train_virtual_output)


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
    wand_entity = model.VirtualEntity(title="Wand", description="For casting spells")
    trainer_wand_entity = model.VirtualEntity(title="TrainingWand", description="For finding cast points")

    entities = [
        player_entity,
        card_entity,
        greeting_tag_entity,
        wand_entity,
        trainer_wand_entity,
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
        wand_entity: [
            schema.Property("previousCast", schema.String()),
            schema.Property("temp1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("temp2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("temp3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ill3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench1", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench2", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ench3", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("charged", schema.Numeric(type=schema.NumericType.Integer)),
        ],
        trainer_wand_entity: [
            schema.Property("castle", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("cathedral", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("train", schema.Numeric(type=schema.NumericType.Integer)),
            schema.Property("ship", schema.Numeric(type=schema.NumericType.Integer)),
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


    wands = [
        "tag1",
        "tag2",
        "tag3",
        "tag4",
        "tag5",
        "tag6",
        "tag7",
        "tag8",
        "tag9",
        "tag10",
        "tag11",
        "tag12",
    ]
    for nfc in wands:
        wand_instance = model.InstanceEntity(virtual_entity=wand_entity,tag=nfc)
        db.add_instance_entity(wand_instance)

    training_wands = [
        "nfc1",
        "nfc2",
        "nfc3",
        "nfc4",
        "nfc5",
        "nfc6",
        "nfc7",
        "nfc8",
        "nfc9",
        "nfc10",
        "nfc11",
        "nfc12",
    ]
    for nfc in training_wands:
        training_wand_instance = model.InstanceEntity(virtual_entity=trainer_wand_entity,tag=nfc)
        db.add_instance_entity(training_wand_instance)

    return entities

def add_actions(db):
    speaker_virtual_output_id = 1 # FIXME: don't hardcode this

    wand_cast_central_ast = CompoundStatement(statements=[
        # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Casting Spell temp1")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio temp1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio temp2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio temp3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ill1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ill2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ill3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ench1.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ench2.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio ench3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=3,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    wand_cast_ship_ast = CompoundStatement(statements=[
        # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Casting Spell temp1")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio temp1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio temp2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio temp3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ill1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ill2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ill3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ench1.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ench2.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=4,
                            resource=StringLiteral("Playaudio ench3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=4,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    wand_cast_castle_ast = CompoundStatement(statements=[
        # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio temp1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio temp2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio temp3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ill1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ill2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ill3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ench1.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ench2.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=6,
                            resource=StringLiteral("Playaudio ench3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=6,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    wand_cast_train_ast = CompoundStatement(statements=[
        # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Casting Spell temp1")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio temp1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio temp2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio temp3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ill1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ill2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ill3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ench1.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ench2.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=7,
                            resource=StringLiteral("Playaudio ench3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=7,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    wand_cast_cathedral_ast = CompoundStatement(statements=[
        # if charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(1),
            ),
            # -> Wand is charged play spell
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Casting Spell temp1")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio temp1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp2")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio temp2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell temp3")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio temp3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not temp3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="il1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill1")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ill1.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill2")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ill2.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ill3")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ill3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ill3")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench1")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ench1.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench1",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench1")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench2")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ench2.wav"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench2")),

                    ]),
                ),
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench3",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(2),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Casting Spell ench3")),
                        OutputStatement(
                            output=5,
                            resource=StringLiteral("Playaudio ench3.mp3"),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(1),
                        ),
                    ]),
                    # -> Not this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ench3")),

                    ]),
                ),
                # Take away charge
                SetAttrStatement(
                    obj="__INPUT__",
                    name="charged",
                    rvalue=IntegerLiteral(0),
                ),
            ]),
            # -> Wand is empty
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is not charged")),
                OutputStatement(
                    output=5,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_temp1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=2,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="temp1",
                    rvalue=IntegerLiteral(2),
                ),
                OutputStatement(
                    output=3,
                    resource=StringLiteral("Playaudio charging.mp3"),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=3,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_temp2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp2",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_temp3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell temp3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="temp2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="temp3",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ill1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=2,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="ill1",
                    rvalue=IntegerLiteral(2),
                ),
                OutputStatement(
                    output=3,
                    resource=StringLiteral("Playaudio charging.mp3"),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ill2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill2",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ill3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ill3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ill2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ill3",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ench1 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench1")),
                # output sound and set spell = 2
                PrintStatement(StringLiteral("Charging Wand")),
                OutputStatement(
                    output=2,
                    resource=GetAttrExpression(
                        obj="__INPUT__",
                        name="previousCast",
                    ),
                ),
                SetAttrStatement(
                    obj="__INPUT__",
                    name="ench1",
                    rvalue=IntegerLiteral(2),
                ),
                OutputStatement(
                    output=3,
                    resource=StringLiteral("Playaudio charging.mp3"),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ench2 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench2")),
                # output sound and set spell = 2
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench1",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench2",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    charge_wand_ench3 = CompoundStatement(statements=[
        # if not already charged
        IfElseStatement(
            condition=BinaryOp(
                left=GetAttrExpression(
                    obj="__INPUT__",
                    name="charged",
                ),
                operator=nodes.Operator.EQ,
                right=IntegerLiteral(0),
            ),
            # -> Wand is not charged check predecessors
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Charging Spell ench3")),
                # if spell = 2, output sound and set spell 1
                IfElseStatement(
                    condition=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ench2",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    # -> Spell is charged play spell
                    if_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Charging Wand")),
                        OutputStatement(
                            output=2,
                            resource=GetAttrExpression(
                                obj="__INPUT__",
                                name="previousCast",
                            ),
                        ),
                        SetAttrStatement(
                            obj="__INPUT__",
                            name="ench3",
                            rvalue=IntegerLiteral(2),
                        ),
                        OutputStatement(
                            output=3,
                            resource=StringLiteral("Playaudio charging.mp3"),
                        ),
                    ]),
                    # -> Not ready for this spell
                    else_body=CompoundStatement(statements=[
                        PrintStatement(StringLiteral("Not ready for this spell")),
                        OutputStatement(
                            output=2,
                            resource=StringLiteral("Playaudio failed.wav"),
                        ),
                    ]),
                ),
            ]),
            # -> Wand is already charged
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Wand is already charged")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Playaudio failed.wav"),
                ),
            ]),
        ),
    ])

    found_castle = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="castle",
            rvalue=IntegerLiteral(1),
        ),
        OutputStatement(
            output=6,
            resource=StringLiteral("Playaudio found.mp3"),
        ),
    ])

    found_ship = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="ship",
            rvalue=IntegerLiteral(1),
        ),
        OutputStatement(
            output=4,
            resource=StringLiteral("Playaudio found.mp3"),
        ),
    ])

    found_cathedral = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="cathedral",
            rvalue=IntegerLiteral(1),
        ),
        OutputStatement(
            output=5,
            resource=StringLiteral("Playaudio found.mp3"),
        ),
    ])

    found_train = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="train",
            rvalue=IntegerLiteral(1),
        ),
        OutputStatement(
            output=7,
            resource=StringLiteral("Playaudio found.mp3"),
        ),
    ])

    found_central = CompoundStatement(statements=[
        OutputStatement(
            output=3,
            resource=StringLiteral("Playaudio found.mp3"),
        ),
    ])

    check_training_complete = CompoundStatement(statements=[
        IfElseStatement(
            # if all ley lines have been found, play training complete
            condition=BinaryOp(
                left=BinaryOp(
                    left=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="castle",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    operator=nodes.Operator.LOGICAL_AND,
                    right=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="ship",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                ),
                operator=nodes.Operator.LOGICAL_AND,
                right=BinaryOp(
                    left=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="train",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                    operator=nodes.Operator.LOGICAL_AND,
                    right=BinaryOp(
                        left=GetAttrExpression(
                            obj="__INPUT__",
                            name="cathedral",
                        ),
                        operator=nodes.Operator.EQ,
                        right=IntegerLiteral(1),
                    ),
                ),
            ),
            if_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Training complete")),
                OutputStatement(
                    output=2,
                    resource=StringLiteral("Training complete."),
                ),
            ]),
            else_body=CompoundStatement(statements=[
                PrintStatement(StringLiteral("Training has not been complete.")),

                OutputStatement(
                    output=2,
                    resource=StringLiteral("Training has not been completed."),
                ),
            ]),
        ),
    ])

    reset_training = CompoundStatement(statements=[
        SetAttrStatement(
            obj="__INPUT__",
            name="train",
            rvalue=IntegerLiteral(1),
        ),
        SetAttrStatement(
            obj="__INPUT__",
            name="castle",
            rvalue=IntegerLiteral(1),
        ),
        SetAttrStatement(
            obj="__INPUT__",
            name="cathedral",
            rvalue=IntegerLiteral(1),
        ),
        SetAttrStatement(
            obj="__INPUT__",
            name="ship",
            rvalue=IntegerLiteral(1),
        ),
    ])

    wand_cast_central_str = unparser.to_json(wand_cast_central_ast)
    wand_cast_ship_str = unparser.to_json(wand_cast_ship_ast)
    wand_cast_cathedral_str = unparser.to_json(wand_cast_cathedral_ast)
    wand_cast_castle_str = unparser.to_json(wand_cast_castle_ast)
    wand_cast_train_str = unparser.to_json(wand_cast_train_ast)
    charge_temp1_str = unparser.to_json(charge_wand_temp1)
    charge_temp2_str = unparser.to_json(charge_wand_temp2)
    charge_temp3_str = unparser.to_json(charge_wand_temp3)
    charge_ill1_str = unparser.to_json(charge_wand_ill1)
    charge_ill2_str = unparser.to_json(charge_wand_ill2)
    charge_ill3_str = unparser.to_json(charge_wand_ill3)
    charge_ench1_str = unparser.to_json(charge_wand_ench1)
    charge_ench2_str = unparser.to_json(charge_wand_ench2)
    charge_ench3_str = unparser.to_json(charge_wand_ench3)
    found_ship_str = unparser.to_json(found_ship)
    found_cathedral_str = unparser.to_json(found_cathedral)
    found_train_str = unparser.to_json(found_train)
    found_castle_str = unparser.to_json(found_castle)
    found_central_str = unparser.to_json(found_central)
    check_training_complete_str = unparser.to_json(check_training_complete)
    reset_training_str = unparser.to_json(reset_training)

    wand_entity = db.get_virtual_entity_by_name(name="Wand")
    training_wand_entity = db.get_virtual_entity_by_name(name="TrainingWand")

    actions = [
        model.Action(name="Cast Spell - Central", ast=wand_cast_central_str, wants_entity=wand_entity),
        model.Action(name="Cast Spell - Ship", ast=wand_cast_ship_str, wants_entity=wand_entity),
        model.Action(name="Cast Spell - Cathedral", ast=wand_cast_cathedral_str, wants_entity=wand_entity),
        model.Action(name="Cast Spell - Castle", ast=wand_cast_castle_str, wants_entity=wand_entity),
        model.Action(name="Cast Spell - Train", ast=wand_cast_train_str, wants_entity=wand_entity),
        model.Action(name="Charge temp1", ast=charge_temp1_str, wants_entity=wand_entity),
        model.Action(name="Charge temp2", ast=charge_temp2_str, wants_entity=wand_entity),
        model.Action(name="Charge temp3", ast=charge_temp3_str, wants_entity=wand_entity),
        model.Action(name="Charge ill1", ast=charge_ill1_str, wants_entity=wand_entity),
        model.Action(name="Charge ill2", ast=charge_ill2_str, wants_entity=wand_entity),
        model.Action(name="Charge ill3", ast=charge_ill3_str, wants_entity=wand_entity),
        model.Action(name="Charge ench1", ast=charge_ench1_str, wants_entity=wand_entity),
        model.Action(name="Charge ench2", ast=charge_ench2_str, wants_entity=wand_entity),
        model.Action(name="Charge ench3", ast=charge_ench3_str, wants_entity=wand_entity),
        model.Action(name="Check Training", ast=check_training_complete_str, wants_entity=training_wand_entity),
        model.Action(name="Found Ship", ast=found_ship_str, wants_entity=training_wand_entity),
        model.Action(name="Found Castle", ast=found_castle_str, wants_entity=training_wand_entity),
        model.Action(name="Found Train", ast=found_train_str, wants_entity=training_wand_entity),
        model.Action(name="Found Cathedral", ast=found_cathedral_str, wants_entity=training_wand_entity),
        model.Action(name="Found Central", ast=found_central_str, wants_entity=training_wand_entity),
        model.Action(name="Reset Training", ast=reset_training_str, wants_entity=training_wand_entity),

    ]

    for action in actions:
        db.add_action(action)

    return actions


def add_events(db, *, actions, devices, scenes):
    events = [
        model.Event(
            name="Central Event",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[0].id,
        ),
        model.Event(
            name="Ship Event",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[1].id,
        ),
        model.Event(
            name="Cathedral Event",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[0].id,
        ),
        model.Event(
            name="Castle Event",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[1].id,
        ),
        model.Event(
            name="Train Event",
            scene_id=scenes[0].id,
            type=model.EventTypes.scan,
            device_id=devices[0].id,
        ),
    ]

    for event in events:
        db.add_event(event)

    event_actions_list = [
        # Central action
        model.EventActions(event_id=events[0].id, action_id=actions[0].id),
        model.EventActions(event_id=events[0].id, action_id=actions[19].id),

        # Ship action
        model.EventActions(event_id=events[1].id, action_id=actions[1].id),
        model.EventActions(event_id=events[1].id, action_id=actions[15].id),
        # Cathedral action
        model.EventActions(event_id=events[2].id, action_id=actions[2].id),
        model.EventActions(event_id=events[2].id, action_id=actions[18].id),

        # Castle action
        model.EventActions(event_id=events[3].id, action_id=actions[3].id),
        model.EventActions(event_id=events[3].id, action_id=actions[16].id),

        # Train action
        model.EventActions(event_id=events[4].id, action_id=actions[4].id),
        model.EventActions(event_id=events[4].id, action_id=actions[17].id),

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
