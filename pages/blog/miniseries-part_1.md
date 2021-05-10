---
title: "Mini series - Speed up your development process (part 1)"
date: 2021-04-28T06:00:00+01:00
type: Engineering
tags:
  - tools
  - code generation
cover: /img/posts/jonaslagoni-miniseries-part1/blog-miniseries-cover.webp
authors:
  - name: Jonas Lagoni
    photo: /img/avatars/jonaslagoni.webp
    link: https://github.com/jonaslagoni
    byline: AsyncAPI Maintainer
featured: true
---

How can you utilize code generation to speed up the development process and only focus on what is important, the business logic? In this mini-series we will explore the ways AsyncAPI and code generation can work hand in hand beyond generating documentation. 

Structure of the miniseries:
* **Part 1: Designing the API's with AsyncAPI**
* Part 2: Implementing the applications using code generation
* Part 3: Black-box testing the applications using code generation
* Part 4: Introducing new changes when using code generation
* Part 5: The path to 1 billion players - Scaling the applications and finding bottlenecks with code generation

**Don't see this blog post series as anything other then an example workflow, this is purely how I do it with my applications and how I use AsyncAPI and it's tooling to my advantage. Use this as an inspiration to finding an approach that works for you.**

# Backstory

Back in 2019 when I started contributing to the tooling of AsyncAPI, I was still in university studying for a masters in software engineering, and had at that point been a student developer at a company called [EURISCO](http://eurisco.dk/), for about 3 years. Beside that I have always had side projects that I worked on in my spare time, and it was one of these side projects that sparked my need for AsyncAPI. 

My side project at that time was a [Rust](https://rust.facepunch.com/) game server plugin which collected in game events, such as when a player farms resources, kills another player, loots a container, etc, and send them to a backend. Later these could be extracted by an API to display the players progression and detailed account on what you did on the game server. 

Initially I used OpenAPI to describe the API and the great thing was their tooling allowed me generate clients and servers in different languages which really speed up the implementation process.

I soon encountered a use case that required me to push data to the game server, and solving this with REST was possible, but cumbersome. So I started exploring different alternatives, in terms of event driven architecture, however, none could be described using OpenAPI or offered tooling, so I had to find alternatives. 

That was when I vaguely remembered a meeting where AsyncAPI was mentioned. Around that time, at work, we began to switch from a custom socket protocol to [NATS](https://nats.io/), and at the same time they spend some time figuring out how to mainstream the process and document the API's, and this is where they found and adopted AsyncAPI. So I started to use AsyncAPI in my project, and sparked my first ever encounter with open source, but that is a story for another time, maybe.

So this blog post is a dedication to that experience, showcasing how I use AsyncAPI to document and generate code to speed up the development process, and maybe spark your interest in building the best tooling possible.

# To that end

Explaining something is always better with actual examples, therefore I will be creating a little system to show you how code generation can help the development process. 

![General setup](/img/posts/jonaslagoni-miniseries-part1/blog-miniseries-general-setup.webp)

I will be creating a system of two applications, a **game server** and a **processor** using a micro-service architecture with no public facing API. How a player interact with the **game server** could be through a phone, a computer, Xbox or PlayStation, for us this is out of scope for this project, we only care about the interaction between the **game server** and the **processor**. The round dot between some broker and the game server represent how others may grab/interact with the application, ergo its API. The same thing is for the processor.

The main point of the **game server** will be to simulate the interaction of the player. This means it will simulate the following events: when players join the game server, pick up items in game, uses the chat, hit one another, and eventually disconnect.

The backend **processor** will be subscribing to these events to process them. In our example it will simply save the received data directly to a database.

I will not get into the specifics of the stack for this system yet since it have no effect on the writing of the API documents for the two applications.

# Designing the API's with AsyncAPI
I always use the [design first principle](https://apisyouwonthate.com/blog/api-design-first-vs-code-first), even when we are talking about internal systems, which means describing the two applications, **game server** and **processor** using the AsyncAPI specification before starting with the implementation.

Using AsyncAPI to define an internal system is not entirely apparent how to do, since AsyncAPI is build to define behavior from the perspective of the external user. I will be clarifying this a bit more later on with actual examples, but if you want to go deeper into this, or alternatively read Nic Townsend's post about [Demystifying the Semantics of Publish and Subscribe](https://www.asyncapi.com/blog/publish-subscribe-semantics). 

## The game server
I always start basic, and first define all the different channels for which the **game server** should produce events over.

```yaml
asyncapi: 2.0.0
info: 
  title: "Game server"
  version: "0.0.1"
channels: 
  game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
    description: Channel used when a player picks up an item in-game
  game/server/{serverId}/events/player/{playerId}/connect:
    description: Channel used when a player joins (connect to) the game server
  game/server/{serverId}/events/player/{playerId}/disconnect:
    description: Channel used when a player leaves (disconnects from) the game server
  game/server/{serverId}/events/player/{playerId}/chat: 
    description: Channel used when a player writes something in chat
  game/server/{serverId}/events/player/{playerId}/hit: 
    description: Channel used when a player hit another player in-game
```

Channels must be defined as a [RFC 6570 URI template](https://www.asyncapi.com/docs/specifications/2.0.0#channelsObject), regardless of how the underlying broker . The way I like to structure my channels, is to utilize parameters to separate the action from information about the event, so it describes, on what server the event was performed `{serverId}`, by what player `{playerId}` and in case of **pickup**, what item `{itemId}` gets picked up. For the last part of the channel we describe what the event was, **pickup**, **connect**, **disconnect**, etc.

Next we define the actual definition of the channels, and here I will focus on explaining the channel `game/server/{server_id}/events/player/{player_id}/item/{item_id}/pickup`. The full AsyncAPI document can be found [here](https://github.com/jonaslagoni/asyncapi-miniseries/blob/master/AsyncAPI/GameServer.yaml).

```yaml
...
  game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
    description: Channel used when a player picks up an item in-game
    parameters:
      serverId: 
        description: The id of the server the action was performed on
        schema: 
          type: string
      playerId: 
        description: The id of the player who performed the action
        schema: 
          type: string
      itemId: 
        description: The id of item picked up
        schema: 
          type: string
    subscribe: 
      message:
        payload:
          type: object
          properties:
            pickupTimestamp:
              type: string
              format: date-time
              description: The timestamp the item was picked up
          $id: PlayerItemPickupPayload
          additionalProperties: false
...
```
This is the full AsyncAPI channel definition for describing the event for when a player picks up an item in-game.

First we have the definition of **parameters** used in the channel. **serverId** tells us where the action originates from, the **playerId** tells us who performed the action, and the **itemId** tells us which item was picked up and should all validate against a value with type **string**.

![Game server setup](/img/posts/jonaslagoni-miniseries-part1/blog-miniseries-gameserver-api.webp)

Next we have the **subscribe** operation, which might not make much sense at first glance. We do want the **game server** to publish this event right? 

And you would be correct, but this is how you currently define operations in AsyncAPI. You define the operation others may interact. This means that the **game server** publishes on this channel and others may **subscribe** to it \[[1](#view-property)\]\[[3](#clarify-view)\]. 

The **payload** of the channel (is described using a super-set of JSON Schema draft 7) should validate against an **object** which contains the property **pickupTimestamp**, which should validate against a **string**. When **additionalProperties** is **false**, no extra properties may be added to the object (by default this is **true** in JSON Schema draft 7). The **$id** keyword are used as an identifier for that specific schema, in this case we name the object schema **PlayerItemPickupPayload**.

## The backend processor
Next we design the **processor** API which contains all the same channels as the **game server**, but with a different operation keyword. 

![Processor setup](/img/posts/jonaslagoni-miniseries-part1/blog-miniseries-processor-api.webp)

This is again because we want to define how others may interact with our **processor**. This means that instead of using the `subscribe` operation we use `publish` to tell others that they can publish to this channel since the backend **processor** are subscribing to it. The full AsyncAPI document for the **processor** can be found [here](https://github.com/jonaslagoni/asyncapi-miniseries/blob/master/AsyncAPI/Processor.yaml). 

```yaml
...
  game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
    ...
    publish: 
      ...
...
```

## Introducing reusability
At the moment each of the AsyncAPI documents contains their own definition of the channels. But what if we where to add a new validation rule such as a new property to the **playerItemPickupPayload** schema? In our case we would have to change this for both applications which is way too much work :smile:

We can therefore introduce **$ref** to separate the parameters and messages into smaller sections for reusability. I will be placing all separate components into a **components** directory in the same directory the AsyncAPI documents reside.

Just a quick note, at the moment it is not possible to reuse channels and operations directly, therefore we must do it to the parameters and message individually \[[2](#channel-reusability)\]. 

First we separate the different parameters, for simplicity we add all of them into the same file `./components/Parameters.yaml`.
```yaml
serverId:
  description: The id of the server
  schema: 
    type: string
playerId:
  description: The id of the player who performed the action
  schema: 
    type: string
itemId:
  description: The id of item
  schema: 
    type: string
```

And then change all the channel parameters to reference the external parameter definition.
```yaml
...
  game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
    description: Channel used when a player picks up an item in-game
    parameters:
      serverId: 
        $ref: "./components/Parameters.yaml#/serverId"
      playerId: 
        $ref: "./components/Parameters.yaml#/playerId"
      itemId: 
        $ref: "./components/Parameters.yaml#/itemId"
    ...
...
```

For the messages we add a new file per message instead of keeping everything in the same file as parameters, I use this approach since I find it easier to maintain and extend.

We add the message file `./components/messages/PlayerItemPickup.yaml`
```yaml
payload:
  type: object
  properties:
    pickupTimestamp:     
      type: string
      format: date-time
      description: The timestamp the item was picked up
  $id: PlayerItemPickupPayload
  additionalProperties: false
```

and alter the channel definition for the **game server** to:
```yaml
...
  game/server/{serverId}/events/player/{playerId}/item/{itemId}/pickup:
    description: Channel used when a player picks up an item in-game
    parameters:
      serverId: 
        $ref: "./components/Parameters.yaml#/serverId"
      playerId: 
        $ref: "./components/Parameters.yaml#7playerId"
      itemId: 
        $ref: "./components/Parameters.yaml#/itemId"
    subscribe: 
      message:
        $ref: './components/messages/PlayerItemPickup.yaml'
...
```

These changes are applied to the **processor** as well. All the AsyncAPI files can be found [here](https://github.com/jonaslagoni/asyncapi-miniseries/tree/master/AsyncAPI).
# What's next
Now that our API's are designed for our two applications, we can move on to Part 2: Implementing the applications using code generation.

# Related issues
In case you are interested in jumping into our discussions and be part of the community that drives the specification and tools, I have referenced some of the outstanding issues and discussions related to the different aspects I have referenced in the post.
1. [Add a View property to the info section to change the perspective of subscribe and publish operations](https://github.com/asyncapi/spec/issues/390) <a name="view-property"></a>
2. [Reusing channel definitions across files is hard](https://github.com/asyncapi/spec/issues/415) <a name="channel-reusability"></a>
3. [Confusions with the Publish and Subscribe meaning/perspective](https://github.com/asyncapi/spec/issues/520) <a name="clarify-view"></a>

> Cover photo by <a href="https://unsplash.com/@hidd3n?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Kevin Horvat</a> on <a href="https://unsplash.com/s/photos/software?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  