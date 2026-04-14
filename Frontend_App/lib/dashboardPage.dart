import 'package:closet/utils.dart';
import 'package:flutter/material.dart';

import 'package:image_picker/image_picker.dart';
import 'dart:io';

class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => DashboardPageState();
}

class DashboardPageState extends State<DashboardPage> {
  StorageService storage = StorageService();
  late Future<UserData?> _userDataFuture;

  @override
  void initState() {
    super.initState();
    _userDataFuture = storage.getUserData();
  }

  Future<void> _addAndUpdateClothes(BuildContext context) async {
    try {
      final result = await Navigator.pushNamed(context, '/dashboard/addClothes');
      print('The result is ${result.toString()}');
      if(result as int == 200) {
        print('New clothes added');
        setState(() {
          _userDataFuture = storage.getUserData();
        });
      }
    } catch (e, stacktrace) {
      print(stacktrace);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.large(
        onPressed: () => _addAndUpdateClothes(context),
        child: Icon(Icons.add),
      ),
      drawer: Drawer(
        child: ListView(
          children: [
            DrawerHeader(
              child: FittedBox(child: Logo()),
            ),
            ListTile(
              leading: Icon(Icons.logout),
              title: const Text('Log Out'),
              onTap: () => doLogout(context),
            ),
          ],
        ),
      ),
      //bottomNavigationBar: DashboardNavBar(),
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: SafeArea(
        minimum: const EdgeInsets.all(16),
        child: FutureBuilder(
          future: _userDataFuture,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.done) {
              if(snapshot.hasData) {
                UserData data = snapshot.data!;
                return SingleChildScrollView(
                  child: Column(
                    children: [
                      Text('Hello, ${data.name}!', style: TextStyle(fontSize: 30),),
                      ClothesList(user: data),
                    ],
                  ),
                );
              }
              return Center(child: Text('Loading UserData failed. Please log out and try again'),);
            }
            return Center(child: CircularProgressIndicator(),);
          },
        ),
      ),
    );
  }
}

class ClothesList extends StatefulWidget {
  const ClothesList({super.key, required this.user});

  final UserData user;

  @override
  State<ClothesList> createState() => _ClothesListState();
}

class _ClothesListState extends State<ClothesList> {
  late Future<List<ClothesItem>> clothesList;

  @override
  void initState() {
    super.initState();
    clothesList = doGetClothes(widget.user);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
      future: clothesList,
      builder: (context, snapshot) {
        if (snapshot.hasData && snapshot.data!.isNotEmpty) {
          return Column(
            children: [
              for (ClothesItem item in snapshot.data!)
                ClothesListItem(clothes: item),
            ],
          );
        }
        if (snapshot.hasData && snapshot.data!.isEmpty) {
          TextStyle _textStyle = const TextStyle(fontSize: 20,);
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 200),
            child: Column(
              spacing: 20.0,
              children: [
                Text('Your closet is empty...', style: const TextStyle(fontSize: 30, fontWeight: FontWeight.bold),),
                Text('Time to go shopping, then add your haul by clicking the button below!', style: _textStyle, textAlign: TextAlign.center,),
                //Text('then add your haul by clicking the button below!', style: _textStyle,),
              ],
            ),
          );
        }
        if(!snapshot.hasData && snapshot.connectionState == ConnectionState.done) {
          return Text('failure');
        }
        return CircularProgressIndicator();
      }
    );
  }
}

@immutable
class ClothesListItem extends StatelessWidget {
  const ClothesListItem({super.key, required this.clothes});

  final ClothesItem clothes;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsetsGeometry.symmetric(horizontal: 24, vertical: 16),
      child: AspectRatio(
        aspectRatio: 16 / 9,
        child: ClipRRect(
          borderRadius: BorderRadiusGeometry.circular(16),
          child: Stack(
            children: [
              _buildBackground(context),
              _buildGradient(),
              _buildText(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBackground(BuildContext context) {
    String url = 'http://ec-albo.xyz:5000${clothes.imagePath}';
    return Positioned.fill(child: Image.network(url, fit: BoxFit.cover,));
  }

  Widget _buildGradient() {
    return Positioned.fill(
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.transparent, Colors.black.withValues(alpha: 0.7)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: const [0.6, 0.95],
          ),
        ),
      ),
    );
  }

  Widget _buildText() {
    return Positioned(
      left: 20,
      bottom: 20,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            clothes.title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            '${clothes.brand} - ${clothes.size} ${clothes.type}',
            style: const TextStyle(color: Colors.white, fontSize: 14),
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
    if(_clothesFormKey.currentState!.validate()) {
      var storage = StorageService();
      UserData? user = await storage.getUserData();
      if (user == null) return;
      int result = await doCreateClothes(
        user.token,
        _titleController.text,
        _sizeController.text,
        _typeController.text,
        _paletteController.text,
        brand: _brandController.text,
        //tags: _tagsController.text, TODO figure out how to send tags
        image: _image
      );
      if (result == 200 && mounted) { //adding was successful
        Navigator.pop(context, result);
      } else { //failed
        showSnackBar(context, 'Error $result: failed to add item');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Clothing Item'),),
      body: SafeArea(
        minimum: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
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
      ),
      floatingActionButton: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
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
          FloatingActionButton.large(
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