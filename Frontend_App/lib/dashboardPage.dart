import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget{
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: NavigationBar(
        destinations: const<Widget>[
          //overview
          NavigationDestination(
            icon: Icon(Icons.dashboard), 
            label: 'Home'
          ),

          //my closet
          NavigationDestination(
            icon: Icon(Icons.checkroom), //TODO: replace with shirt icon
            label: 'My Closet'
          ),

          //lookbooks
          NavigationDestination(
            icon: Icon(Icons.list), //TODO: replace with shirt icon
            label: 'Lookbooks'
          ),

          //planner
          NavigationDestination(
            icon: Icon(Icons.calendar_month), //TODO: replace with shirt icon
            label: 'Planner'
          ),
        ],
      ),
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context), 
          child: const Text('Log out'),
          ),
      )
    );
  }
}
