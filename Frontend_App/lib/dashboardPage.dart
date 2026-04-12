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
  double MAX_IMAGE_DIMENSION = 1024;

  final GlobalKey<FormState> _clothesFormKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _sizeController = TextEditingController();
  final TextEditingController _typeController = TextEditingController();
  final TextEditingController _paletteController = TextEditingController();
  final TextEditingController _brandController = TextEditingController();
  final TextEditingController _tagsController = TextEditingController();

  @override
  void dispose() {
    _titleController.dispose();
    _sizeController.dispose();
    _typeController.dispose();
    _paletteController.dispose();
    _brandController.dispose();
    _tagsController.dispose();
    super.dispose();
  }

  Future<void> _takePhoto() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.camera, maxHeight: MAX_IMAGE_DIMENSION, maxWidth: MAX_IMAGE_DIMENSION);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  Future<void> _choosePhoto() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery, maxHeight: MAX_IMAGE_DIMENSION, maxWidth: MAX_IMAGE_DIMENSION);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  void _submitClothes() async {
    //showSnackBar(context, 'submit clothes pressed');
    var storage = StorageService();
    UserData? user = await storage.getUserData();
    if (user == null) return;
    String result = await doCreateClothes(
      user.token,
      _titleController.text,
      _sizeController.text,
      _typeController.text,
      _paletteController.text,
      brand: _brandController.text,
      //tags: _tagsController.text, TODO figure out how to send tags
      image: _image
    );
    showSnackBar(context, result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Clothing Item'),),
      body: SingleChildScrollView(
        child: Column(
          spacing: 20.0,
          children: [
            (_image != null)
              ? Image.file(_image!, fit: BoxFit.fitHeight, height: 400.0) //TODO display image some way ot her than a force size (parallax would be cool)
              : Text('No image selected'),
            Form(
              key: _clothesFormKey,
              child: Column(
                spacing: 20.0,
                children: [
                  //title field
                  TextFormField(
                    controller: _titleController,
                    decoration: InputDecoration(labelText: 'Title *'),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a title';
                      }
                      return null;
                    },
                  ),

                  //size field
                  TextFormField(
                    controller: _sizeController,
                    decoration: InputDecoration(labelText: 'Size *'),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a size';
                      }
                      return null;
                    },
                  ),

                  //type field
                  TextFormField(
                    controller: _typeController,
                    decoration: InputDecoration(labelText: 'Type *'),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a type';
                      }
                      return null;
                    },
                  ),

                  //palette field
                  TextFormField(
                    controller: _paletteController,
                    decoration: InputDecoration(labelText: 'Palette *'),
                    validator: (String? value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a palette';
                      }
                      return null;
                    },
                  ),

                  //brand field (optional)
                  TextFormField(
                    controller: _brandController,
                    decoration: InputDecoration(labelText: 'Brand'),
                  ),

                  //tags field (optional)
                  TextFormField(
                    controller: _tagsController,
                    decoration: InputDecoration(labelText: 'Tags'),
                  ),
                ],
              ),
            ),
          ],
        ),
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

          //spacer
          SizedBox(height: 20,),

          //submit clothes
          FloatingActionButton(
            heroTag: 'submit',
            onPressed: _submitClothes,
            child: Icon(Icons.add),
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