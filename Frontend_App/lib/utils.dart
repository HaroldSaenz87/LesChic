import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart'; //used by showSnackBar
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http; //used to contact the API

void showSnackBar(dynamic context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}

/*custom implementation of FlutterSecureStorage*/
class StorageService {
  static final StorageService _instance = StorageService._internal();

  factory StorageService() => _instance;

  StorageService._internal();

  final String KEY_USER_DATA = 'UserData';
  final _storage = const FlutterSecureStorage();

  Future<void> saveUserData(UserData data) async
  {
    await _storage.write(key: KEY_USER_DATA, value: data.toJson());
  }

  //returns null if data not found
  Future<UserData?> getUserData() async {
    try {
      String? json = await _storage.read(key: KEY_USER_DATA);
      return UserData.fromJson(json!);
    } catch (e) {
      return null;
    }
  }
}

/*Data Structures*/
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

  String toJson(){
    Map<String, dynamic> map = {
      'uid': uid,
      'name': name,
      'email': email,
      'token': token
    };

    return json.encode(map);
  }
}

/*API CALLS*/
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

Future<String> doRegister(String name, String lastName, String email, String password) async {
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
