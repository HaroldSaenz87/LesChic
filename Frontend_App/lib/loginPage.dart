import 'utils.dart'; //custom utils
import 'package:flutter_svg/flutter_svg.dart';

import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool isLoginMode = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        minimum: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: <Widget>[
            //Spacer(), // TODO: replace this with proper positioning
            Logo(), //TODO: make app title prettier; add logo
        
            //set view based on "toggle" below
            isLoginMode ? LoginView() : RegisterView(),
        
            //swap between login and register view
            SegmentedButton(
              showSelectedIcon: false,
              segments: const <ButtonSegment<bool>>[
                ButtonSegment<bool>(
                  value: true,
                  label: Text('Login'),
                ),
                ButtonSegment<bool>(
                  value: false,
                  label: Text('Register'),
                ),
              ], 
              selected: <bool>{isLoginMode},
              onSelectionChanged: (Set<bool> newSelection) {
                setState(() {
                  isLoginMode = newSelection.first;
                });
              },
            ),
        
            //Spacer(), //TODO: refer to spacer above for note
          ],
        ),
      ),
    );
  }
}

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: <Widget>[
        LoginForm(),
        Forgot(),
      ],
    );
  }
}

class LoginForm extends StatefulWidget{
  const LoginForm({super.key});

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm>{
  final GlobalKey<FormState> _logFormKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  //TODO: handle incorrect login!!! currently shows generic failure message
  void loginPressed() async
  {
    String message;
    if(_logFormKey.currentState!.validate()){
      try {
        UserData _userData = await doLogin(_emailController.text, _passwordController.text);
        message = 'Logged in as ${_userData.name}';
        
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
      catch (e) {
        message = 'Failed to log in';
      }
      showSnackBar(context, message);

      
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _logFormKey,
      child: Column(
        spacing: 16.0,
        children: <Widget>[
          //email field
          TextFormField(
            controller: _emailController,
            decoration: InputDecoration(
              icon: Icon(Icons.email),
              labelText: 'Email',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              return null;
            },
          ),

          //password field
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(
              icon: Icon(Icons.password),
              labelText: 'Password',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your password';
              }
              return null;
            },
          ),

          //login button
          FilledButton(
            onPressed: () => loginPressed(),
            child: Text('Login'),
          ),
        ],
      ),
    );
  }
}

class Forgot extends StatelessWidget {
  const Forgot({super.key});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => Navigator.pushNamed(context, '/login/forgot'),
      child: Text('Forgot Password?'),
    );
  }
}

class ForgotPage extends StatefulWidget {
  const ForgotPage({super.key});

  @override
  State<ForgotPage> createState() => _ForgotPageState();
}

class _ForgotPageState extends State<ForgotPage> {
  final GlobalKey<FormState> _forgotFormKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void forgotPressed() async {
    if(_forgotFormKey.currentState!.validate()) {
      String response = await doResetPassword(_emailController.text);
      if (mounted) showSnackBar(context, response);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Forgot Password'),),
      body: SafeArea(
        minimum: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            Logo(),
            Form(
              key: _forgotFormKey,
              child: Column(
                spacing: 16.0,
                // mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  TextFormField(
                    controller: _emailController,
                    decoration: InputDecoration(
                      icon: Icon(Icons.email),
                      labelText: 'Email',
                    ),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      return null;
                    },
                  ),
                  FilledButton(
                    onPressed: forgotPressed,
                    child: Text('Send reset email'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class RegisterView extends StatefulWidget{
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {
  final GlobalKey<FormState> _regFormKey = GlobalKey<FormState>();
  final TextEditingController _firstController = TextEditingController();
  final TextEditingController _lastController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  @override
  void dispose() {
    _firstController.dispose();
    _lastController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void registerPressed() async
  {
    if (_regFormKey.currentState!.validate()){
      String result = await doRegister(_firstController.text, _lastController.text, _emailController.text, _passwordController.text);
      showSnackBar(context, result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _regFormKey,
      child: Column(
        spacing: 16.0,
        children: <Widget>[
          //first name field
          TextFormField(
            controller: _firstController,
            decoration: InputDecoration(
              icon: Icon(Icons.person),
              labelText: 'First',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your first name';
              }
              return null;
            },
          ),

          //last name field
          TextFormField(
            controller: _lastController,
            decoration: InputDecoration(
              icon: Icon(null),
              labelText: 'Last',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your last name';
              }
              return null;
            },
          ),

          //email field
          TextFormField(
            controller: _emailController,
            decoration: InputDecoration(
              icon: Icon(Icons.email),
              labelText: 'Email',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              return null;
            },
          ),

          //password field
          TextFormField(
            controller: _passwordController,
            obscureText: true,
            decoration: InputDecoration(
              icon: Icon(Icons.password),
              labelText: 'Password',
            ),
            validator: (String? value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a password';
              }
              return null;
            },
          ),

          //register button
          FilledButton(
            onPressed: () => registerPressed(),
            child: Text('Create Account'),
          ),
        ],
      ),
    );
  }
}
