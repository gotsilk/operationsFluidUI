<html>
<head>
%{--    <meta name="layout" content="${gspLayout ?: 'main'}"/>--}%
    <title><g:message code='springSecurity.login.title'/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css" media="screen">
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
        }
        #login {
            padding: 0px;
            margin: 0;
            text-align: center;
        }

        #login .inner {
            width: 340px;
            padding-bottom: 6px;
            margin: 20px auto;
            text-align: left;
            border: 1px solid #aab;
            background-color: #f0f0fa;
            -moz-box-shadow: 2px 2px 2px #eee;
            -webkit-box-shadow: 2px 2px 2px #eee;
            -khtml-box-shadow: 2px 2px 2px #eee;
            box-shadow: 2px 2px 5px #CCC;
        }

        #login .inner .fheader {
            padding: 18px 26px 14px 26px;
            background-color: #17a2b8;
            margin: 0px 0 14px 0;
            color: #FFF;
            font-size: 18px;
            font-weight: bold;
        }

        p {
            padding: 3px 20px;
        }

        input {
            width: 100%;
            padding: 5px 10px;
            border-radius: 3px;
            border: 1px solid #AAA;
        }

        button {
            border: 0;
            background-color: #17a2b8;
            color: #FFF;
            padding: 5px 15px;
            border-radius: 3px;
        }

        #logo {
            width: 340px;
        }

        #submit-pane {
            text-align: right;
        }
    </style>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>

<body>
<div id="login">
    <h1>Login</h1>
    <div class="inner shadow-lg">
        <div class="fheader"><g:message code='springSecurity.login.header'/></div>

        <g:if test='${flash.message}'>
            <div class="login_message">${flash.message}</div>
        </g:if>

        <form action="${postUrl ?: '/login/authenticate'}" method="POST" id="loginForm" class="cssform" autocomplete="off">
            <div class="input-group p-3">
                <input placeholder="Username" type="text" class="form-control" name="${usernameParameter ?: 'username'}"
                       id="username" aria-label="Username" aria-describedby="basic-addon1"/>
            </div>
            <div class="input-group p-3">
                <input placeholder="Password" type="password" aria-label="Username" aria-describedby="basic-addon1"
                       class="form-control" name="${passwordParameter ?: 'password'}" id="password"/>
            </div>
            <p id="submit-pane">
                <button type="submit" class="btn btn-success"><g:message code="springSecurity.login.button"/></button>
            </p>
        </form>
    </div>
</div>
<script>
    (function() {
        document.forms['loginForm'].elements['${usernameParameter ?: 'username'}'].focus();
    })();
</script>
</body>
</html>
