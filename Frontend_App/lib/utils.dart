import 'package:flutter/material.dart';

void showSnackBar(dynamic context, String message){
  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
}
