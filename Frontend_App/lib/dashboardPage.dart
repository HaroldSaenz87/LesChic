import 'package:closet/utils.dart';
import 'package:flutter/material.dart';

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
            onPressed: () => Navigator.pop(context),
            child: const Text('Log out'),
          ),

          //add clothes button
          ElevatedButton(
            onPressed: () => showSnackBar(context, 'Add clothes pressed'),
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
  @override
  Widget build(BuildContext context) {
    return Placeholder();
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