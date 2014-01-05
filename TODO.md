Major components

1. Authorization:
   Responsible for authorization of users to website using 
   twitter or any other social media login widget.

2. GET component:
   Exposted APIs which gets the relevant data needed.
   This APIs ensures the data is fetched from TWITTER if not
   already present or updated in the database. Otherwise, reads data from 
   our own database.
   We need to put some update logic to decide when the data is old enough, to
   be fetched again from the twitter. Intially we can put a simple logic of 
   time_stamp history of may be 5 minutes.

3. FETCH Component:
   Fetches the data from the TWITTER using twitter APIs. There are twitter
   developed client available for almost all the languages.
   source :https://dev.twitter.com/docs/twitter-libraries

4. PERSIST Component:
   This persists the data fetched from twitter into our database. 
   This module needs to be configurable enough to switch databases from
   mongo to Neo4j when required. Intially we can keep mongo as our primary
   DB for all the data.

5. INDEX Component:
   This will be the heart of our application. This components will be called
   from various regular JOBs and possibly from other places.
   This will contain all the complex logic and algorithm to index the the data
   in database and partition it in way, so that all kind of queries required in our use case
   are supported.
   We skip this part for now.

6. RECOMMEND ENGINE Component:
   Once the data in database are indexed as per our use case need. These set of
   APIs make call to indexed data to recommend content, connections etc. to the 
   users.
   This can only be used after the INDEX components is in place.
