import 'dart:convert';
import 'dart:io';

import 'utils.dart'; //custom utils. here, used to print debug messages as SnackBar

import 'package:http/http.dart' as http; //used to contact api

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

class UserData {
  final String uid;
  final String name;
  final String email;
  final String token;

  const UserData({required this.uid, required this.name, required this.email, required this.token});

  factory UserData.fromJson(String json) {
    Map<String, dynamic> _map = jsonDecode(json) as Map<String, dynamic>;

    return switch (_map) {
      {'uid': String uid, 'name': String name, 'email': String email, 'token': String token} => UserData (
        uid: uid,
        name: name,
        email: email,
        token: token,
      ),
      _ => throw const FormatException('Failed to log in.'),
    };
  }
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
        
        Navigator.pushNamed(context, '/dashboard');
      }
      catch (e) {
        message = 'Failed to log in';
      }
      showSnackBar(context, message);

      
    }
  }

  Future<UserData> doLogin(String email, String password) async {
    Map<String, String> _loginInfo = {'email':email, 'password':password};
    String _url = 'http://ec-albo.xyz:5000/api/auth/login';
    final response = await http.post(
      Uri.parse(_url),
      headers: {
        HttpHeaders.contentTypeHeader: 'application/json'
      },
      body: json.encode(_loginInfo)
    );
    return UserData.fromJson(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _logFormKey,
      child: Column(
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

  Future<String> doRegister(String name, String lastName, String email, String password) async
  {
    Map<String, String> _registerInfo = {'name':name, 'lastName':lastName, 'email':email, 'password':password};
    String _url = 'http://ec-albo.xyz:5000/api/auth/register';
    final response = await http.post(
      Uri.parse(_url),
      headers: {
        HttpHeaders.contentTypeHeader: 'application/json'
      },
      body: json.encode(_registerInfo)
    );
    Map<String, dynamic> _map = jsonDecode(response.body) as Map<String, dynamic>;
    return _map['msg'] ?? 'Error registering';
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _regFormKey,
      child: Column(
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
