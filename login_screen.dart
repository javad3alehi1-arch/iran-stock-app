import 'package:flutter/material.dart';
class LoginScreen extends StatelessWidget {
  final phoneController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('ورود')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(controller: phoneController, decoration: InputDecoration(labelText: 'شماره')),
            SizedBox(height:16),
            ElevatedButton(onPressed: () {
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => Scaffold(appBar: AppBar(title: Text('Home')), body: Center(child: Text('Home')))));
            }, child: Text('ورود'))
          ],
        ),
      ),
    );
  }
}
