import 'utils.dart'; //custom utils. here, used to print debug messages as SnackBar

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
      body: Column(
        children: <Widget>[
          Spacer(), // TODO: replace this with proper positioning
          Text('Le Chic'), //TODO: make app title prettier; add logo

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

          Spacer(), //TODO: refer to spacer above for note
        ],
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

  void loginPressed()
  {
    if(_logFormKey.currentState!.validate()){
      showSnackBar(context, 'Login Pressed (with valid input)');
      Navigator.pushNamed(context, '/dashboard');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _logFormKey,
      child: Column(
        children: <Widget>[
          //email field
          TextFormField(
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
      onPressed: () => showSnackBar(context, 'Forgot Password clicked'),
      child: Text('Forgot Password?'),
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

  void registerPressed()
  {
    if (_regFormKey.currentState!.validate()){
      showSnackBar(context, 'Create account pressed (with valid input)');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _regFormKey,
      child: Column(
        children: <Widget>[
          //first name field
          TextFormField(
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
