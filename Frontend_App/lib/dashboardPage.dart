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
      body: Center(
        child: ElevatedButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Log out'),
        ),
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