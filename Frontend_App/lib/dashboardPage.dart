import 'package:closet/utils.dart';
import 'package:flutter/material.dart';

import 'package:image_picker/image_picker.dart';
import 'dart:io';

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      //bottomNavigationBar: DashboardNavBar(),
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Column(
        children: [
          //log out button
          ElevatedButton(
            onPressed: () => Navigator.pushReplacementNamed(context, '/'),
            child: const Text('Log out'),
          ),

          //add clothes button
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/dashboard/addClothes'),
            child: const Text('Add clothes'),
          ),
        ],
      ),
    );
  }
}

class AddClothesScreen extends StatefulWidget {
  const AddClothesScreen({super.key});

  @override
  State<AddClothesScreen> createState() => _AddClothesScreenState();
}

class _AddClothesScreenState extends State<AddClothesScreen> {
  File? _image;
  final ImagePicker _picker = ImagePicker();

  Future<void> _takePhoto() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.camera);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _choosePhoto() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Clothing Item'),),
      body: Center(
        child: (_image != null) ? Image.file(_image!) : Text('No image selected'),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          //take new photo
          FloatingActionButton(
            heroTag: 'camera',
            onPressed: _takePhoto,
            child: Icon(Icons.photo_camera),
          ),

          //spacer
          SizedBox(height: 10,),
          
          //choose from gallery
          FloatingActionButton(
            heroTag: 'gallery',
            onPressed: _choosePhoto,
            child: Icon(Icons.photo_library),
          ),
        ],
      ),
    );
  }
}

class DashboardNavBar extends StatelessWidget {
  const DashboardNavBar ({super.key});

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      destinations: const <Widget>[
        //overview
        NavigationDestination(
          icon: Icon(Icons.dashboard), 
          label: 'Home',
        ),

        //my closet
        NavigationDestination(
          icon: Icon(Icons.checkroom), //TODO: replace with a better icon
          label: 'My Closet',
        ),

        // lookbooks
        NavigationDestination(
          icon: Icon(Icons.list), //TODO: replace with a better icon
          label: 'Lookbooks',
        ),

        //planner
        NavigationDestination(
          icon: Icon(Icons.calendar_month), //TODO: replace with a better icon
          label: 'Planner',
        ),
      ],
    );
  }
}