import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart'; //used by showSnackBar
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http; //used to contact the API

final String FONT_NAME = 'Cormorant Garamond';

void showSnackBar(dynamic context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}

Future<void> doLogout(BuildContext context) async {
  StorageService storage = StorageService();
  await storage.clearData();
  Navigator.pushReplacementNamed(context, '/');
}

//times out and assumes false after 7 seconds (5 felt too short, 10 too long)
Future<bool> checkLoggedIn() async {
  bool result = await doRefreshToken().timeout(
    const Duration(seconds: 7),
    onTimeout: () => false
  );
  print('login check: $result');
  return result;
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

  //remove the data from storage
  Future<void> clearData() async {
    _storage.delete(key: KEY_USER_DATA);
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
  final storage = StorageService();
  UserData data = UserData.fromJson(response.body);
  await storage.saveUserData(data);
  return data;
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

Future<String> doCreateClothes (String token, String title, String size, String type, String palette, {String? brand, List<String>? tags, File? image}) async { //TODO make sure parameters are set correctly

  String _url = 'http://ec-albo.xyz:5000/api/clothes';
  var request = http.MultipartRequest('POST', Uri.parse(_url));
  request.headers.addAll({'x-token': token});

  //add provided fields
  request.fields['title'] = title;
  request.fields['size'] = size;
  if (brand != null) request.fields['brand'] = brand;
  request.fields['type'] = type;
  request.fields['palette'] = palette;
  //if (tags != null) request.fields['tags'] = tags; //TODO figure out how to add tags
  if (image != null) request.files.add(await http.MultipartFile.fromPath('image', image.path));

  print('request: ${request.toString()}');
  var response = await request.send();
  print(await response.stream.bytesToString());
  return response.statusCode.toString();
}

Future<bool> doRefreshToken() async {
  StorageService storage = StorageService();
  UserData? user = await storage.getUserData();

  //no data saved, failed
  if (user == null) return false;

  //there's data, try refreshing it
  String _url = 'http://ec-albo.xyz:5000/api/auth/renew';
  final response = await http.get(
    Uri.parse(_url),
    headers: {
      'x-token': user.token
    }
  );

  print(response.statusCode);

  // response is bad, failed
  if (response.statusCode != 200) {
    return false;
  }

  //response good, replace user data with new token
  user = UserData.fromJson(response.body);
  storage.saveUserData(user);
  return true;
}

Future<String> doResetPassword(String email) async {
  Map<String, String> _forgotInfo = {'email': email};
  String _url = 'http://ec-albo.xyz:5000/api/auth/forgot-password';
  final response = await http.post(
    Uri.parse(_url),
    headers: {
      HttpHeaders.contentTypeHeader : 'application/json'
    },
    body: json.encode(_forgotInfo),
  );

  Map<String, dynamic> _res = jsonDecode(response.body);
  return _res['msg'] ?? 'Error resetting password';
}
