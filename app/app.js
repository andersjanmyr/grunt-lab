requirejs.config(
    {
        "baseUrl": "scripts",
        "paths": {
            "app": "../app",
            "moment": "../components/momentjs/moment",
            "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min"
        }
    }
);

requirejs(["main"]);