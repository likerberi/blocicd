import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:uuid/uuid.dart';

const _uuid = Uuid();

@immutable
class Todo {
  const Todo({
    required this.id,
    required this.desc,
    this.completed = false,
  });
  final String id;
  final String desc;
  final bool completed;

  Todo copyWith({String? id, String? desc, bool? completed}) {
    return Todo(id: id ?? this.id, desc: desc ?? this.desc, completed: completed ?? this.completed,);
  }

  @override
  String toString() {
    // TODO: implement toString
    return 'Todo(description: $desc, completed: $completed)';
  }
}

class TestScreen extends StateNotifier<List<Todo>> {
  TestScreen([List<Todo>? initialTodos]) : super(initialTodos ?? []);

  void add(String description) {
    // StateNotifier.. ~ State
    state = [
      ...state,
      Todo(
        id: _uuid.v4(),
        desc: description,
      ),
    ];
  }

  void toggle(String id) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          todo.copyWith(completed: !todo.completed)
        else
          todo,
    ];
  }

  void edit({required String id, required String desc}) {
    state = [
      for (final todo in state)
        if (todo.id == id)
          todo.copyWith(id: todo.id, desc: todo.desc)
        else
          todo,
    ];
  }

  void remove(Todo target) {
    state = state.where((element) => element.id != target.id).toList();
  }
}
