var nodemon = require('nodemon');
var child_process = require('child_process');
var myNodemon = nodemon({ script: 'bin/www' })
    .on('start', function onStart() {
        return;
    })
    .on('restart', function onRestart() { //['duplicate-backend', 'watch-scripts-backend']
        console.log("################################ restarted gulp-nodemon ################################");
        return child_process.exec('npm grunt', function(err, out, code) {
            myNodemon.emit('quit');
            return     
        })
        
       
        
    })
    .on('crash', function onCrash() {
        console.log("################################# crash gulp-nodemon ###############################");
        return;
    })
    .on('exit', function onExit() {
        console.log("################################# quit gulp-nodemon ###############################");
        return runSequence('nodemon', function () { console.log("Run"); });
    });
return myNodemon;