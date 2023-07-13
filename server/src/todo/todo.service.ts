import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return this.todoRepository.save(createTodoDto);
  }

  findAll(completed?: boolean) {
    const order: 'ASC' | 'DESC' = 'DESC';

    if (!completed) {
      return this.todoRepository.find({ order: { id: order } });
    } else {
      return this.todoRepository
        .createQueryBuilder('todo')
        .where('todo.completed = :completed', { completed })
        .orderBy('todo.id', order)
        .getMany();
    }
  }

  findOne(id: number) {
    return this.todoRepository.findOneBy({ id });
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    const { name, completed } = updateTodoDto;
    const todo = await this.todoRepository.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException('todo not found');
    }
    todo.name = name || todo.name;
    todo.completed = completed;
    return this.todoRepository.save(todo);
  }

  remove(id: number) {
    this.todoRepository.delete(id);
  }
}
