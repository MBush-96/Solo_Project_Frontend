# Solo_Project_Frontend


### Overview

Users will login to the website and on authentication be shown their profile screen. They will be able to create their city if they havent already done so as well as train the troops that they want. The player can also decide to attack another user if they wish by clicking the attack button and choosing which user they would like to attack. If they commit to this attack, user one's designated troops will attack user two's city. The game will calcualte the opposing armies forces against the defending armies' forces and determine the winner. All caualties of the war will be removed from each users respective troop numbers. If the opposing force wins the war for the city they will conquer the city, and claim it. resulting in extra income, resources, etc.. and the defending force will lose all troops and the city that it was defending. If it is their only city, the user will be reset and have to create a new city from the start.

### Wireframes

User is not logged in<br />
<img src="https://i.imgur.com/gLcf280.png" width="370" height="500" />

User profile page<br />
<img src="https://i.imgur.com/nlagQ1U.png" width="370" height="500" />

User attack screen<br />
<img src="https://i.imgur.com/lb6k8s7.png" width="370" height="500" />

User after report screen<br />
<img src="https://i.imgur.com/zbuO6KK.png" width="370" height="500" />

MVP ERB<br />
<img src="https://i.imgur.com/7AaQQQP.png" width="710" height="300" />


### User stories

- When I'm not logged, in the only thing displayed is the login button (Or recent wars).
- When I login, I see my own cities and the active troops in those cities. I also see a section below that for training a specific troop that I wish to be train. I see an attack player button that when clicked displays all the cities I can currently attack.
- When I train a set of troops, those troops are added to my cities troop count, when they are done training.
- When I attack another city, I am visually notified of the outcome of my attack, if I won or lost the fight and how many troops I lost. If I won the fight, I see the new city added to the list of owned citys in my profile page.
- If I lost the fight and I was defending, I am notified that I was attacked and visually notified with who attacked me, how many troops they attacked with, and my casualties. The city is no longer one of my owned cities in my profile page.

### Routes Inventory

|Verb|Route|Description|
|----|-----------|-----|
|Post| app.post('/city', func) | Create city, Add city |
|Post| app.post('/user', func) | Create user |
|Put | app.put('/city', func) | Update city owner, update city troops, update previous city owner ID |
|Put | app.put('/user/troops', func) | Update troop count, delete any casualties from troops |
|Get | app.get('/user', func) | Retrieve user info |
|Get | app.get('/city/:id', func) | Retrieve city info |


### MVP checklist

- User can login
- User can create and name their city and it is added to their owned cities
- User can train troops.
- User can attack other cities and take them.
- User can lose cities and get reset to the start.


### Stretch goals

- Training troops takes time and resources.
- Improving your city takes time and resources.
- Recent wars section on site that lists all the recent wars and its participants.
- Alliances?
- More complex algorithim for determining damage, such as how thick tank armor is and what size caliber bullet something is shooting.
