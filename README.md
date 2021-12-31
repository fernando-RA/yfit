# undercard_18898

# RUN PROJECT

## Locally 
- clone https://github.com/Rec-Technologies/undercard-18898/
- open terminal and cd into the ```project/backend``` directory
- get the git crypt key from your teammates: 

        export GIT_CRYPT_KEY=<insert-key-here>
        echo $GIT_CRYPT_KEY | base64 --decode >> secret.key && git-crypt unlock secret.key && rm secret.key

- Run:

    ``` make develop ```
    
    >  wait for it to finnish, then run:

    ``` make migrate ```
    

# DEPLOYING TO HEROHU
## philosophy
- heroku maintains it's own repo for undercard-staging. 
- you clone that repo locally, and set it up such that it has to remotes to the github and to heroku
- as you develop in the github repo, you pull those updates to the local heroku repo, and push to the heroku remote
- when you're happy with stage, on heroku website you can backup the prod DB and promote stage to prod.

## steps
- follow steps on heroku to setup the heroku repo locally:
  - https://dashboard.heroku.com/apps/undercard-staging/deploy/heroku-git
- run git remote to check, and setup if necessary the remotes to github (i call it origin) and heroku (i call it heroku-staging)
- when you've deployed and tested staging, you can go to this pipeline page to promote:
  - https://dashboard.heroku.com/pipelines/d6e48d00-d8e4-433e-b531-1e086f72cdea
  - BEFORE promotion, I recommend going into production pipeline -> resources -> postgres -> durablility -> manual backup
    - haven't had to use the backups yet.

## monitoring
- you can clone heroku stage and prod both locally
- inside those repos, i can run `heroku logs -f` to view logs in realtime, or `heroku logs -n 1500` to see the last 1500 lines of the log


# ENV VARIABLES
- the golden copy of env variables is in heroku itself: 
  - https://dashboard.heroku.com/apps/undercard-staging/settings for staging, and the analogous for production
  - click "reveal config vars"


# DATABASE ACCESS
- install pgadmin, 
- use the config vars in heroku to connect to both the stage and prod dbs.
- you'll notice there are separate configs for different DB's. These were setup when testing cloning prod db back to staging. If confused, use the db that's tagged with "DATABASE" on the Resources page
- obligatory warning: you can do real damage. rather than changing things from the DB, i recommend using the django admin console instead:
  - https://undercard-production.herokuapp.com/admin/
